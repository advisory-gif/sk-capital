"""CSV logger for Apollo API calls."""

from __future__ import annotations

import csv
import json
import os
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


class ApiCallLogger:
    """Append every API request/response to a CSV for auditing."""

    FIELDS = ["timestamp", "method", "path", "status", "request", "response"]

    def __init__(self, path: str | os.PathLike[str]):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        if not self.path.exists():
            with self.path.open("w", newline="", encoding="utf-8") as fh:
                csv.writer(fh).writerow(self.FIELDS)

    def write(
        self,
        method: str,
        path: str,
        status: int,
        request: Optional[dict[str, Any]],
        response: Optional[dict[str, Any]],
    ) -> None:
        row = [
            datetime.now(timezone.utc).isoformat(),
            method,
            path,
            status,
            json.dumps(request, default=str) if request is not None else "",
            json.dumps(_truncate(response), default=str) if response is not None else "",
        ]
        with self._lock, self.path.open("a", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerow(row)


def _truncate(payload: Any, max_chars: int = 8000) -> Any:
    """Avoid blowing up the CSV with huge people-search payloads."""
    s = json.dumps(payload, default=str)
    if len(s) <= max_chars:
        return payload
    return {"_truncated": True, "_preview": s[:max_chars]}
