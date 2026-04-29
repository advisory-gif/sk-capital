"""Create an Apollo email sequence (emailer_campaign) and enroll contacts."""

from __future__ import annotations

import logging
from typing import Any, Optional

from .client import ApolloClient
from .config import SEQUENCE_STEPS, SequenceStep

log = logging.getLogger(__name__)


def find_email_account_id(client: ApolloClient, send_from_email: str) -> Optional[str]:
    """Look up the connected mailbox id for the configured send-from address.

    Endpoint: GET /email_accounts
    """
    resp = client.get("/email_accounts")
    if resp.dry_run:
        return None
    accounts = resp.data.get("email_accounts") or resp.data.get("accounts") or []
    for acct in accounts:
        if (acct.get("email") or "").lower() == send_from_email.lower():
            return acct.get("id")
    log.warning(
        "No connected mailbox in Apollo matches %s. Connect it first or update .env.",
        send_from_email,
    )
    return None


def create_sequence(
    client: ApolloClient,
    *,
    name: str,
    daily_limit: int,
) -> Optional[str]:
    """Create the empty sequence shell.

    Endpoint: POST /emailer_campaigns
    """
    body = {
        "name": name,
        "permissions": "team_can_use",
        "active": True,
        "label_name": name,
        "daily_limit": daily_limit,
    }
    resp = client.post("/emailer_campaigns", json_body=body)
    if resp.dry_run:
        log.info("[DRY-RUN] Would create sequence %r (daily_limit=%s)", name, daily_limit)
        return None
    campaign = resp.data.get("emailer_campaign") or resp.data
    sid = campaign.get("id") if isinstance(campaign, dict) else None
    log.info("Created sequence %r (id=%s)", name, sid)
    return sid


def add_step(
    client: ApolloClient,
    sequence_id: Optional[str],
    step: SequenceStep,
    *,
    email_account_id: Optional[str],
    position: int,
) -> None:
    """Append one step (email) to the sequence.

    Endpoint: POST /emailer_steps
    The companion email body is written via POST /emailer_touches once the
    step exists. Apollo's create endpoint accepts both in a single call when
    you nest the touch payload, which is what we do here.
    """
    body = {
        "emailer_campaign_id": sequence_id,
        "position": position,
        "wait_time": step.day,
        "wait_mode": "day",
        "type": step.step_type,
        "email_account_id": email_account_id,
        "subject": step.subject,
        "body_html": step.body.replace("\n", "<br>\n"),
        "body_text": step.body,
    }
    body = {k: v for k, v in body.items() if v is not None}
    client.post("/emailer_steps", json_body=body)
    log.info("Added step %d (day %d): %s", position, step.day, step.subject)


def build_sequence(
    client: ApolloClient,
    *,
    name: str,
    daily_limit: int,
    send_from_email: str,
) -> Optional[str]:
    sequence_id = create_sequence(client, name=name, daily_limit=daily_limit)
    email_account_id = find_email_account_id(client, send_from_email)
    for i, step in enumerate(SEQUENCE_STEPS, start=1):
        add_step(
            client,
            sequence_id,
            step,
            email_account_id=email_account_id,
            position=i,
        )
    return sequence_id


def enroll_contacts(
    client: ApolloClient,
    *,
    sequence_id: Optional[str],
    contact_ids: list[str],
    email_account_id: Optional[str] = None,
) -> dict[str, Any]:
    """Enroll a batch of contacts into the sequence.

    Endpoint: POST /emailer_campaigns/{id}/add_contact_ids
    """
    if not contact_ids:
        return {"added": 0}
    body: dict[str, Any] = {"contact_ids": contact_ids, "send_email_from_email_account_id": email_account_id}
    body = {k: v for k, v in body.items() if v is not None}
    path = f"/emailer_campaigns/{sequence_id or 'DRY_RUN'}/add_contact_ids"
    resp = client.post(path, json_body=body)
    return resp.data
