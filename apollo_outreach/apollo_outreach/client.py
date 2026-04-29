"""Thin wrapper around the Apollo.io REST API.

Handles auth, rate limiting, retries with exponential backoff, and CSV
request/response logging. The dry-run flag short-circuits any state-mutating
call so you can preview the campaign before sending.

Reference: https://apolloio.github.io/apollo-api-docs/
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass
from typing import Any, Optional

import requests

from .logger import ApiCallLogger

log = logging.getLogger(__name__)

APOLLO_BASE_URL = "https://api.apollo.io/api/v1"

# Methods that mutate Apollo state. In dry-run mode these are skipped.
WRITE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

# Endpoints that are read-only POSTs (search-style). These still execute in
# dry-run because they don't change state.
READ_ONLY_POST_PATHS = {
    "/mixed_people/search",
    "/mixed_companies/search",
    "/organizations/search",
}


@dataclass
class ApolloResponse:
    status_code: int
    data: dict[str, Any]
    dry_run: bool = False


class ApolloAPIError(RuntimeError):
    pass


class ApolloClient:
    def __init__(
        self,
        api_key: str,
        *,
        dry_run: bool = True,
        min_request_interval_s: float = 0.6,
        max_retries: int = 4,
        logger: Optional[ApiCallLogger] = None,
        base_url: str = APOLLO_BASE_URL,
    ):
        if not api_key:
            raise ValueError("Apollo API key is required")
        self.api_key = api_key
        self.dry_run = dry_run
        self.min_request_interval_s = min_request_interval_s
        self.max_retries = max_retries
        self.base_url = base_url.rstrip("/")
        self.logger = logger
        self._last_request_ts: float = 0.0
        self._session = requests.Session()
        self._session.headers.update(
            {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Api-Key": api_key,
            }
        )

    def _throttle(self) -> None:
        """Sleep if needed to respect the configured min interval."""
        elapsed = time.monotonic() - self._last_request_ts
        wait = self.min_request_interval_s - elapsed
        if wait > 0:
            time.sleep(wait)

    def _is_dry_run_skip(self, method: str, path: str) -> bool:
        if not self.dry_run:
            return False
        if method.upper() not in WRITE_METHODS:
            return False
        return path not in READ_ONLY_POST_PATHS

    def request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[dict[str, Any]] = None,
        json_body: Optional[dict[str, Any]] = None,
    ) -> ApolloResponse:
        method = method.upper()
        url = f"{self.base_url}{path}"

        if self._is_dry_run_skip(method, path):
            preview = {"dry_run": True, "method": method, "path": path, "body": json_body}
            log.info("[DRY-RUN] %s %s (skipped)", method, path)
            if self.logger:
                self.logger.write(method, path, status=0, request=json_body, response=preview)
            return ApolloResponse(status_code=0, data=preview, dry_run=True)

        last_exc: Optional[Exception] = None
        for attempt in range(self.max_retries + 1):
            self._throttle()
            self._last_request_ts = time.monotonic()
            try:
                resp = self._session.request(
                    method, url, params=params, json=json_body, timeout=30
                )
            except requests.RequestException as exc:
                last_exc = exc
                backoff = 2**attempt
                log.warning("Network error on %s %s: %s (retry in %ss)", method, path, exc, backoff)
                time.sleep(backoff)
                continue

            # Handle rate limiting / transient server errors with backoff.
            if resp.status_code in (429, 500, 502, 503, 504):
                backoff = 2**attempt
                retry_after = resp.headers.get("Retry-After")
                if retry_after:
                    try:
                        backoff = max(backoff, int(retry_after))
                    except ValueError:
                        pass
                log.warning(
                    "Apollo returned %s on %s %s (retry in %ss)",
                    resp.status_code,
                    method,
                    path,
                    backoff,
                )
                if attempt < self.max_retries:
                    time.sleep(backoff)
                    continue

            try:
                data = resp.json() if resp.content else {}
            except json.JSONDecodeError:
                data = {"_raw": resp.text}

            if self.logger:
                self.logger.write(method, path, resp.status_code, json_body, data)

            if not resp.ok:
                raise ApolloAPIError(
                    f"Apollo {method} {path} failed: {resp.status_code} {data}"
                )
            return ApolloResponse(status_code=resp.status_code, data=data)

        raise ApolloAPIError(f"Apollo {method} {path} failed after retries: {last_exc}")

    # Convenience wrappers ---------------------------------------------------

    def get(self, path: str, **kw: Any) -> ApolloResponse:
        return self.request("GET", path, **kw)

    def post(self, path: str, **kw: Any) -> ApolloResponse:
        return self.request("POST", path, **kw)

    def put(self, path: str, **kw: Any) -> ApolloResponse:
        return self.request("PUT", path, **kw)
