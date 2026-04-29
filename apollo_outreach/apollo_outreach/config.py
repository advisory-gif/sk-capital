"""Static campaign configuration: filters, copy, sequence cadence."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date


# --- Prospect filters --------------------------------------------------------

PERSON_TITLES = [
    "CFO",
    "Chief Financial Officer",
    "VP Finance",
    "Vice President Finance",
    "Vice President of Finance",
    "Director of FP&A",
    "Director FP&A",
    "Head of Finance",
    "Controller",
]

# Apollo accepts string ranges like "50,500" — one per element in the list.
EMPLOYEE_COUNT_RANGES = ["50,500"]

# Primary then secondary. Apollo dedupes by person_id across pages.
PERSON_LOCATIONS_PRIMARY = ["India"]
PERSON_LOCATIONS_SECONDARY = ["United States"]

# Free-text industry keywords. Apollo also has industry tag IDs; keywords are
# more forgiving across the long tail of company self-descriptions.
INDUSTRY_KEYWORDS = ["SaaS", "Software", "Technology", "E-commerce", "Manufacturing"]


# --- Sequence copy -----------------------------------------------------------


@dataclass
class SequenceStep:
    day: int                    # 0 = day of enrollment
    subject: str
    body: str                   # plain text or simple HTML; Apollo accepts HTML
    step_type: str = "auto_email"


SEQUENCE_STEPS: list[SequenceStep] = [
    SequenceStep(
        day=0,
        subject="FP&A horsepower for {{company}}",
        body=(
            "Hi {{first_name}},\n\n"
            "I run an FP&A consulting practice helping mid-market finance teams "
            "tighten budgeting, forecasting, and financial modeling. My background "
            "is in finance roles at Amazon, American Express, and TriNet, where I "
            "shipped models and processes for businesses much larger than the ones "
            "I now work with.\n\n"
            "If {{company}} is feeling friction in the monthly close, the annual "
            "plan, or board-level forecasting, I'd love to compare notes. Worth a "
            "20-minute call next week?\n\n"
            "Best,\nSnesh\n"
        ),
    ),
    SequenceStep(
        day=3,
        subject="Re: FP&A horsepower for {{company}}",
        body=(
            "Hi {{first_name}},\n\n"
            "Quick follow-up. A recent client — a Series B SaaS company — cut "
            "their budget cycle from 9 weeks to under 4 by replacing a sprawling "
            "spreadsheet stack with a driver-based model and a clean planning "
            "cadence. Same FP&A team, ~55% less cycle time.\n\n"
            "Happy to walk you through what worked. Open to a short call?\n\n"
            "Best,\nSnesh\n"
        ),
    ),
    SequenceStep(
        day=7,
        subject="Closing the loop",
        body=(
            "Hi {{first_name}},\n\n"
            "I don't want to clutter your inbox, so this will be my last note. "
            "If FP&A support isn't a priority right now, no worries — I'll close "
            "the loop on my end. If timing changes, just reply to this thread "
            "and we can pick it up.\n\n"
            "Wishing {{company}} a strong quarter.\n\n"
            "Best,\nSnesh\n"
        ),
    ),
]


# --- Misc --------------------------------------------------------------------


def list_name_for_today(prefix: str = "FP&A Consulting Outreach") -> str:
    return f"{prefix} - {date.today().isoformat()}"


@dataclass
class CampaignConfig:
    list_name: str = field(default_factory=list_name_for_today)
    sequence_name: str = field(default_factory=list_name_for_today)
    daily_email_limit: int = 30
    max_prospects: int = 500       # cap on people pulled per run
    page_size: int = 100           # Apollo allows up to 100 per page
