import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Layers3,
  ChartNoAxesCombined,
  Wallet,
  Users,
  Check,
} from "lucide-react";
import Team from "@/sections/Team";

const areas = [
  {
    icon: TrendingUp,
    name: "Sales",
    question: "Is the right work coming in?",
    detail: "Pricing, conversion and the customers you serve.",
  },
  {
    icon: Layers3,
    name: "Delivery",
    question: "Is the work running to plan?",
    detail: "Scope changes, handovers and work waiting to be billed.",
  },
  {
    icon: ChartNoAxesCombined,
    name: "Profit",
    question: "What does the work leave behind?",
    detail: "Margins, cost to serve and the mix of work.",
  },
  {
    icon: Wallet,
    name: "Cash",
    question: "When does the money arrive?",
    detail: "Invoice timing, collections and payment terms.",
  },
  {
    icon: Users,
    name: "Capacity",
    question: "Can the team keep up?",
    detail: "Workload, bottlenecks and time spent on rework.",
  },
];
const steps = [
  [
    "01",
    "Start with a question",
    "Agree the business question, the selected records and the limits of the work.",
  ],
  [
    "02",
    "Follow the evidence",
    "Connect what was sold, delivered, billed and paid. Flag gaps rather than guess.",
  ],
  [
    "03",
    "Make the next move",
    "Choose three priorities, with an owner and a date for each. Your team owns execution.",
  ],
];

function BusinessView() {
  return (
    <div
      className="business-view"
      aria-label="Illustrative business review showing quote, delivery, invoice and payment checkpoints"
    >
      <div className="view-topline">
        <span>THE BUSINESS VIEW</span>
        <span className="sample-badge">Illustrative only</span>
      </div>
      <div className="view-heading">
        <h2>
          From good work
          <br />
          to a stronger business.
        </h2>
        <span className="view-mark" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="workflow-track" aria-hidden="true">
        <span>Quote</span>
        <ArrowRight size={15} />
        <span>Deliver</span>
        <ArrowRight size={15} />
        <span>Invoice</span>
        <ArrowRight size={15} />
        <span>Collect</span>
      </div>
      <div className="signal-card">
        <span className="signal-icon">
          <Layers3 size={18} />
        </span>
        <div>
          <strong>Work delivered. Invoice pending.</strong>
          <p>Check the handover before chasing growth.</p>
        </div>
        <span className="signal-tag">Review</span>
      </div>
      <div className="signal-card">
        <span className="signal-icon">
          <ChartNoAxesCombined size={18} />
        </span>
        <div>
          <strong>Extra scope. Same quote.</strong>
          <p>Compare the agreement with the work done.</p>
        </div>
        <span className="signal-tag">Review</span>
      </div>
      <div className="view-bottom">
        <div>
          <span>THE OUTPUT</span>
          <strong>
            3 priorities.
            <br />A clear next step.
          </strong>
        </div>
        <div className="mini-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <p className="view-disclaimer">
        Example questions, not client findings or promised results.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="health home-review">
      <section className="wrap new-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> Business performance. Founder to
            founder.
          </p>
          <h1>
            See the whole business.
            <br />
            <em>
              Know what to
              <br className="desktop-break" /> work on next.
            </em>
          </h1>
          <p className="hero-intro">
            Sales, delivery, profit, cash and capacity are connected. We help
            you see where performance gets stuck and turn that view into
            practical priorities.
          </p>
          <div className="actions">
            <Link className="primary" to="/business-health-review">
              Explore the ₹1,999 pilot{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/#services">
              See the bigger picture <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="hero-caption">
            A focused first step for founder-led service businesses.
          </p>
        </div>
        <BusinessView />
      </section>
      <div className="principle-strip">
        <div className="wrap">
          <span>
            <Check size={16} aria-hidden="true" /> Founder-led
          </span>
          <span>
            <Check size={16} aria-hidden="true" /> Evidence before advice
          </span>
          <span>
            <Check size={16} aria-hidden="true" /> A defined scope
          </span>
          <span>
            <Check size={16} aria-hidden="true" /> Actions your team can own
          </span>
        </div>
      </div>
      <section id="services" className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">One business. Five connected questions.</p>
            <h2>
              A wider lens.
              <br />
              <em>A more useful answer.</em>
            </h2>
          </div>
          <p>
            The numbers tell part of the story. How you win work, deliver it and
            use your team tells the rest. We look at both before recommending
            the next step.
          </p>
        </div>
        <div className="performance-grid">
          {areas.map(({ icon: Icon, name, question, detail }, i) => (
            <article key={name}>
              <div className="area-top">
                <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                <span>0{i + 1}</span>
              </div>
              <h3>{name}</h3>
              <h4>{question}</h4>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pilot-section">
        <div className="wrap pilot-layout">
          <div>
            <p className="eyebrow">A focused place to start</p>
            <h2>
              Good work can get lost
              <br />
              <em>between quote and cash.</em>
            </h2>
            <p className="intro">
              The Revenue Leak Check follows a small set of your
              service-business records from the original quote through delivery,
              invoicing and payment.
            </p>
            <p>
              We look for supported issues worth addressing: an unbilled change,
              a missing handover, a delayed invoice. Then we agree what deserves
              attention first.
            </p>
            <Link className="text-link" to="/business-health-review">
              See exactly what’s included{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <article className="pilot-offer">
            <div className="offer-heading">
              <p className="eyebrow">Revenue Leak Check</p>
              <span className="outline-label">One-off pilot</span>
            </div>
            <div className="offer-price">
              ₹1,999<span>base fee</span>
            </div>
            <ul className="check-list">
              <li>
                <Check size={17} /> One business entity
              </li>
              <li>
                <Check size={17} /> Up to 10 clean, selected items
              </li>
              <li>
                <Check size={17} /> One page. Three evidence-based priorities.
              </li>
              <li>
                <Check size={17} /> Owners, dates and a short explanation
              </li>
            </ul>
            <Link className="primary" to="/business-health-review">
              Review the pilot <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <p className="offer-note">
              Any applicable taxes, final payable total and delivery date are
              confirmed before the engagement begins.
            </p>
          </article>
        </div>
      </section>
      <section id="process" className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">From understanding to action</p>
            <h2>
              Small enough to start.
              <br />
              <em>Clear enough to act.</em>
            </h2>
          </div>
          <p>
            No sprawling discovery exercise. A defined question, usable
            information and a practical discussion about the evidence.
          </p>
        </div>
        <div className="process-grid">
          {steps.map(([n, title, detail]) => (
            <article key={n}>
              <span className="process-number">{n}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap followthrough-band">
        <div>
          <p className="eyebrow">Optional after the first check</p>
          <h2>
            Keep the priorities
            <br />
            <em>from becoming a forgotten list.</em>
          </h2>
        </div>
        <div>
          <p>
            Business Pulse adds a bounded monthly repeat check and
            follow-through on agreed actions. Broader analysis, cleanup and
            implementation get their own scope.
          </p>
          <Link
            className="text-link"
            to="/business-health-review#business-pulse"
          >
            Explore Business Pulse · ₹1,999/month{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p className="small">
            Base fee. Applicable taxes confirmed before enrolment. Explicit
            opt-in; no automatic enrolment.
          </p>
        </div>
      </section>
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Beyond the first check</p>
            <h2>
              Your next question
              <br />
              <em>may need a different scope.</em>
            </h2>
          </div>
          <p>
            The pilot is one entry point. Business performance, growth planning
            and startup reporting can call for deeper, separately agreed work.
          </p>
        </div>
        <div className="audience-grid">
          <Link className="resource-card" to="/businesses">
            <span className="eyebrow">Established businesses</span>
            <h3>
              Make your next stage
              <br />a stronger one.
            </h3>
            <p>
              Pricing, delivery, profitability, cash and the capacity to grow.
            </p>
            <span className="text-link">
              Explore business advisory <ArrowUpRight size={17} />
            </span>
          </Link>
          <Link className="resource-card" to="/startups">
            <span className="eyebrow">Startups</span>
            <h3>
              Connect your ambition
              <br />
              to the operating reality.
            </h3>
            <p>Metrics, unit economics, runway and decision-ready reporting.</p>
            <span className="text-link">
              Explore startup support <ArrowUpRight size={17} />
            </span>
          </Link>
        </div>
      </section>
      <Team />
      <section className="wrap section work-preview">
        <div>
          <p className="eyebrow">See how we think</p>
          <h2>
            Make the work
            <br />
            <em>easier to picture.</em>
          </h2>
          <p className="intro">
            Explore a clearly labelled example of a pilot priority page, or the
            existing illustrative CloudHR financial model.
          </p>
          <Link className="text-link" to="/business-health-review#sample">
            View the sample priority page <ArrowUpRight size={18} />
          </Link>
        </div>
        <Link className="model-card" to="/portfolio">
          <div className="model-label">
            <span>CloudHR</span>
            <span className="outline-label">Illustrative model</span>
          </div>
          <div className="model-lines" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <h3>
            From assumptions
            <br />
            to financial scenarios.
          </h3>
          <span className="text-link">
            Explore the model <ArrowUpRight size={18} />
          </span>
          <p>Synthetic data. Not a client engagement or achieved result.</p>
        </Link>
      </section>
      <section className="closing">
        <div className="wrap">
          <p className="eyebrow">A clear first step</p>
          <h2>
            What is getting in the way
            <br />
            of a stronger business?
          </h2>
          <p>
            Start with the question. Build the evidence. Decide what comes next.
          </p>
          <Link className="primary" to="/business-health-review">
            Explore the Revenue Leak Check{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
