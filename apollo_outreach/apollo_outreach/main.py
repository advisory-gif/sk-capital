"""CLI entrypoint: search prospects, build the list, create the sequence."""

from __future__ import annotations

import argparse
import logging
import os
import sys
from datetime import date
from pathlib import Path

from dotenv import load_dotenv

from .client import ApolloClient
from .config import CampaignConfig
from .logger import ApiCallLogger
from .prospects import add_person_to_list, ensure_label, iter_prospects
from .sequences import build_sequence, enroll_contacts, find_email_account_id

log = logging.getLogger("apollo_outreach")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Apollo.io FP&A outreach automation")
    p.add_argument(
        "--live",
        action="store_true",
        help="Actually create the list and sequence in Apollo. Default is dry-run.",
    )
    p.add_argument(
        "--max-prospects",
        type=int,
        default=None,
        help="Cap on prospects pulled (default: 500).",
    )
    p.add_argument(
        "--list-name",
        default=None,
        help="Override the contact list name (default: 'FP&A Consulting Outreach - <today>').",
    )
    p.add_argument(
        "--log-file",
        default=str(Path("logs") / f"apollo_calls_{date.today().isoformat()}.csv"),
        help="CSV path for API call logs.",
    )
    p.add_argument("-v", "--verbose", action="store_true")
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(name)s | %(message)s",
    )

    load_dotenv()
    api_key = os.environ.get("APOLLO_API_KEY")
    if not api_key:
        log.error("APOLLO_API_KEY is missing. Copy .env.example to .env and set it.")
        return 2

    send_from = os.environ.get("APOLLO_SEND_FROM_EMAIL", "sneshkakkar11@gmail.com")
    daily_limit = int(os.environ.get("DAILY_EMAIL_LIMIT", "30"))

    cfg = CampaignConfig(daily_email_limit=daily_limit)
    if args.max_prospects:
        cfg.max_prospects = args.max_prospects
    if args.list_name:
        cfg.list_name = args.list_name
        cfg.sequence_name = args.list_name

    dry_run = not args.live
    api_logger = ApiCallLogger(args.log_file)
    client = ApolloClient(api_key, dry_run=dry_run, logger=api_logger)

    mode = "DRY-RUN" if dry_run else "LIVE"
    log.info("=== Apollo FP&A outreach (%s) ===", mode)
    log.info("List/Sequence name: %s", cfg.list_name)
    log.info("Mailbox:            %s (cap %d/day)", send_from, cfg.daily_email_limit)
    log.info("Max prospects:      %d", cfg.max_prospects)
    log.info("API call log:       %s", args.log_file)

    # 1. Create the contact list (label).
    label_id = ensure_label(client, cfg.list_name)

    # 2. Search prospects and add each to the list.
    contact_ids: list[str] = []
    pulled = 0
    for person in iter_prospects(client, cfg):
        pulled += 1
        cid = add_person_to_list(client, person, cfg.list_name)
        if cid:
            contact_ids.append(cid)
        if pulled % 25 == 0:
            log.info("Processed %d prospects so far...", pulled)
    log.info("Pulled %d prospects (added %d as contacts)", pulled, len(contact_ids))

    # 3. Build the 3-step sequence.
    sequence_id = build_sequence(
        client,
        name=cfg.sequence_name,
        daily_limit=cfg.daily_email_limit,
        send_from_email=send_from,
    )

    # 4. Enroll the contacts into the sequence.
    email_account_id = find_email_account_id(client, send_from)
    result = enroll_contacts(
        client,
        sequence_id=sequence_id,
        contact_ids=contact_ids,
        email_account_id=email_account_id,
    )
    log.info("Enrollment result: %s", result)

    if dry_run:
        log.info(
            "Dry-run complete. Re-run with --live to actually create the list and sequence."
        )
    else:
        log.info("Done. List=%s Sequence=%s", label_id, sequence_id)
    return 0


if __name__ == "__main__":
    sys.exit(main())
