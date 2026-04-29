# Apollo FP&A Outreach

Automates an FP&A consulting outreach campaign on [Apollo.io](https://apollo.io):
prospect search → contact list → 3-step email sequence.

## Layout

```
apollo_outreach/
├── apollo_outreach/
│   ├── client.py       # Apollo HTTP client (auth, retries, rate limiting, dry-run)
│   ├── config.py       # Filters, sequence copy, campaign settings
│   ├── logger.py       # CSV API-call logger
│   ├── main.py         # CLI entrypoint
│   ├── prospects.py    # People search + contact-list builder
│   └── sequences.py    # Email sequence + enrollment
├── run.py              # `python run.py` launcher
├── requirements.txt
├── .env.example
└── logs/               # API-call CSVs land here
```

## Setup

1. **Python 3.10+** is recommended.
2. Create and activate a virtualenv, then install deps:
   ```bash
   cd apollo_outreach
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Copy the env template and paste your Apollo API key:
   ```bash
   cp .env.example .env
   # edit .env and set APOLLO_API_KEY=...
   ```
   Get the key from **Apollo → Settings → Integrations → API**.
4. Make sure the sending mailbox (`sneshkakkar11@gmail.com` by default) is
   already connected in Apollo under **Settings → Mailboxes**. The script
   looks it up by email address — it does not create mailboxes.

## Running

### Dry-run (default — no Apollo state is mutated)

```bash
python run.py
```

Search calls still hit Apollo (they're read-only), but every list creation,
contact write, sequence creation, and enrollment is **skipped** and only
logged to the CSV. Use this to preview the campaign and confirm endpoint
shapes against your Apollo plan.

### Live run

```bash
python run.py --live
```

This will:
1. Create a contact list (Apollo "label") named
   `FP&A Consulting Outreach - YYYY-MM-DD`.
2. Pull up to 500 prospects matching:
   - **Titles:** CFO, VP Finance, Director of FP&A, Head of Finance, Controller
   - **Company size:** 50–500 employees
   - **Locations:** India (primary) then United States (secondary)
   - **Industries:** SaaS, Software, Technology, E-commerce, Manufacturing
3. Save each prospect as a contact tagged with the list label.
4. Create a 3-step email sequence:
   - **Day 0** — cold intro (Amazon / AmEx / TriNet positioning)
   - **Day 3** — follow-up with a budget-cycle-time value prop
   - **Day 7** — soft-close breakup
5. Enroll the contacts into the sequence using the configured mailbox, with
   a daily send cap of 30 emails (configurable via `DAILY_EMAIL_LIMIT`).

### Useful flags

| Flag | Purpose |
| --- | --- |
| `--live` | Execute writes against Apollo (default is dry-run). |
| `--max-prospects N` | Cap the number of prospects pulled (default 500). |
| `--list-name "..."` | Override the contact-list / sequence name. |
| `--log-file path.csv` | Where to write the API-call log. |
| `-v` / `--verbose` | Debug logging. |

## Logs

Every API call is appended to `logs/apollo_calls_YYYY-MM-DD.csv` with
timestamp, method, path, status code, request body, and (truncated) response.
This file is git-ignored.

## Editing copy or filters

- **Sequence copy & cadence:** `apollo_outreach/config.py` → `SEQUENCE_STEPS`
- **Search filters:** same file → `PERSON_TITLES`, `EMPLOYEE_COUNT_RANGES`,
  `PERSON_LOCATIONS_*`, `INDUSTRY_KEYWORDS`
- **Daily send cap / max prospects:** `.env` (`DAILY_EMAIL_LIMIT`) or
  `--max-prospects` flag

## Notes & caveats

- Apollo's REST surface is mostly stable but a few endpoints
  (`/labels`, `/emailer_steps`, `/emailer_campaigns/{id}/add_contact_ids`) are
  documented under their dashboard rather than the public OpenAPI. If your
  Apollo plan returns a different shape, run dry-run first and inspect the
  CSV log — the request bodies are visible there and easy to tweak in
  `prospects.py` / `sequences.py`.
- Rate limiting: the client throttles to ~1.6 requests/sec and retries 429s
  with exponential backoff (up to 4 attempts).
- The `.env` file is git-ignored. Never commit your API key.
