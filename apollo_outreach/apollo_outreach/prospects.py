"""Search Apollo for prospects and persist them into a contact list."""

from __future__ import annotations

import logging
from typing import Any, Iterable, Optional

from .client import ApolloClient
from .config import (
    EMPLOYEE_COUNT_RANGES,
    INDUSTRY_KEYWORDS,
    PERSON_LOCATIONS_PRIMARY,
    PERSON_LOCATIONS_SECONDARY,
    PERSON_TITLES,
    CampaignConfig,
)

log = logging.getLogger(__name__)


def search_people(
    client: ApolloClient,
    *,
    locations: list[str],
    page: int,
    per_page: int,
) -> dict[str, Any]:
    """Call Apollo's people search.

    Endpoint: POST /mixed_people/search
    Docs: https://docs.apollo.io/reference/people-search
    """
    body = {
        "person_titles": PERSON_TITLES,
        "person_locations": locations,
        "organization_num_employees_ranges": EMPLOYEE_COUNT_RANGES,
        "q_organization_keyword_tags": INDUSTRY_KEYWORDS,
        "page": page,
        "per_page": per_page,
    }
    resp = client.post("/mixed_people/search", json_body=body)
    return resp.data


def iter_prospects(
    client: ApolloClient,
    cfg: CampaignConfig,
) -> Iterable[dict[str, Any]]:
    """Yield deduped prospects across the primary and secondary location pools."""
    seen_ids: set[str] = set()
    yielded = 0

    for locations in (PERSON_LOCATIONS_PRIMARY, PERSON_LOCATIONS_SECONDARY):
        page = 1
        while yielded < cfg.max_prospects:
            data = search_people(
                client,
                locations=locations,
                page=page,
                per_page=cfg.page_size,
            )
            people = data.get("people") or data.get("contacts") or []
            if not people:
                break

            for person in people:
                pid = person.get("id")
                if pid and pid in seen_ids:
                    continue
                if pid:
                    seen_ids.add(pid)
                yield person
                yielded += 1
                if yielded >= cfg.max_prospects:
                    return

            pagination = data.get("pagination") or {}
            total_pages = pagination.get("total_pages") or 0
            if page >= total_pages:
                break
            page += 1


# --- List (label) management ------------------------------------------------


def ensure_label(client: ApolloClient, name: str) -> Optional[str]:
    """Create a label/list with the given name. Returns the label id when known.

    Apollo's labels endpoint: POST /labels {"name": "..."}
    In dry-run, returns None and the caller skips downstream label assignment.
    """
    resp = client.post("/labels", json_body={"name": name})
    if resp.dry_run:
        log.info("[DRY-RUN] Would create label %r", name)
        return None
    label = resp.data.get("label") or resp.data
    label_id = label.get("id") if isinstance(label, dict) else None
    log.info("Created label %r (id=%s)", name, label_id)
    return label_id


def add_person_to_list(
    client: ApolloClient,
    person: dict[str, Any],
    label_name: str,
) -> Optional[str]:
    """Persist an Apollo person as a contact attached to the given label.

    Apollo separates "people" (search results) from "contacts" (saved CRM
    records). We promote the person to a contact via POST /contacts and tag it
    with `label_names` so it lands in the named list.
    """
    body = {
        "first_name": person.get("first_name"),
        "last_name": person.get("last_name"),
        "title": person.get("title"),
        "email": person.get("email"),
        "organization_name": (person.get("organization") or {}).get("name"),
        "label_names": [label_name],
    }
    # Drop empty fields so Apollo doesn't reject the request.
    body = {k: v for k, v in body.items() if v}
    resp = client.post("/contacts", json_body=body)
    if resp.dry_run:
        return None
    contact = resp.data.get("contact") or resp.data
    return contact.get("id") if isinstance(contact, dict) else None
