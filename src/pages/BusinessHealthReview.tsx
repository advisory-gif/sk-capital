import { useState } from "react";
import { siteIsLive, enquiryEmail, enquiryEmailHref } from "@/lib/launch";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  FileCheck2,
  CircleHelp,
  LockKeyhole,
} from "lucide-react";

const questions = [
  [
    "Who is the pilot for?",
    "Founder-led service businesses such as agencies, consultancies and small professional-service teams. It is best suited to one entity with clean, selected records and someone able to act on the findings. Other business models may need a separately agreed scope.",
  ],
  [
    "What counts as one selected item?",
    "One job, project or service engagement that can be traced from its quote or agreed scope through delivery, invoice and payment status. The pilot covers up to 10 selected items for one entity, using a standard input format. It is a sample review, not a review of every transaction in the business.",
  ],
  [
    "What if our information is incomplete or messy?",
    "We flag gaps and agree whether a narrower check is useful. Bookkeeping, reconciliation, custom data cleanup, new dashboards and system integration are outside the pilot. Additional work requires a separate scope and fee.",
  ],
  [
    "How quickly will we receive the review?",
    "We agree the delivery date after confirming scope and the availability of complete, usable inputs. You receive that date before payment or work begins.",
  ],
  [
    "Is ₹1,999 the final amount we pay?",
    "₹1,999 is the base pilot fee. Any applicable taxes and the final payable total are confirmed before you agree to the engagement or pay. This website does not take payment.",
  ],
  [
    "Will the check recover money or increase revenue?",
    "No result is guaranteed. A gap, delayed invoice or estimate does not establish that an amount is recoverable. Findings depend on the evidence supplied and need to be validated in the business context.",
  ],
  [
    "Are meetings and clarification included?",
    "The pilot includes a short explanation of the one-page review and one clarification round. We agree the intake and explanation format with you before the engagement begins.",
  ],
  [
    "Does Business Pulse start automatically?",
    "No. It is a separate, optional ₹1,999/month service requiring explicit opt-in and agreed terms. The scope is a repeat check of up to 10 clean selected items for one entity and action follow-through, with asynchronous follow-up capped at 30 minutes total per month. It is not unlimited consulting. Applicable taxes, the final payable total, service timing, payment and cancellation terms are agreed before enrolment.",
  ],
];

function EnquiryPreview() {
  const [params] = useSearchParams();
  const [service, setService] = useState(
    params.get("service") === "advisory" ||
      params.get("audience") === "startup" ||
      params.get("audience") === "investor"
      ? "Separately scoped advisory"
      : "Revenue Leak Check",
  );
  const [business, setBusiness] = useState("");
  const [priority, setPriority] = useState("");
  const [preview, setPreview] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreview(true);
  }
  return (
    <section id="enquiry" className="enquiry-section section">
      <div className="wrap enquiry-layout">
        <div>
          <p className="eyebrow">
            {siteIsLive ? "Start a conversation" : "Before enquiries open"}
          </p>
          <h2>
            A useful first conversation
            <br />
            <em>starts with the right question.</em>
          </h2>
          <p className="intro">
            Tell us the type of business and the question you would like help
            with. You do not need to share financial records to describe the
            question.
          </p>
          <div className="activation-note">
            <LockKeyhole size={21} aria-hidden="true" />
            <div>
              <strong>
                {siteIsLive
                  ? "A conversation before a data request"
                  : "Enquiry activation pending"}
              </strong>
              <p>
                {siteIsLive
                  ? "Your email app opens a draft for you to review and send. Do not include confidential records. We agree scope, data handling, the final total and a delivery date before any paid work."
                  : "This local launch preview does not send email, make bookings or accept payment. The business contact route must be restored and tested before launch."}
              </p>
            </div>
          </div>
        </div>
        <div className="enquiry-card">
          <h3>Plan your enquiry</h3>
          <p className="small">
            Do not enter confidential records or sensitive personal information.
          </p>
          <form onSubmit={submit}>
            <label htmlFor="service">What would you like to explore?</label>
            <select
              id="service"
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setPreview(false);
              }}
            >
              <option>Revenue Leak Check</option>
              <option>Business Pulse</option>
              <option>Separately scoped advisory</option>
            </select>
            <label htmlFor="business-type">
              Type of business <span>(optional)</span>
            </label>
            <input
              id="business-type"
              value={business}
              maxLength={100}
              placeholder="For example, a design agency"
              autoComplete="off"
              onChange={(e) => {
                setBusiness(e.target.value);
                setPreview(false);
              }}
            />
            <label htmlFor="priority">
              The question you want to answer <span>(optional)</span>
            </label>
            <textarea
              id="priority"
              value={priority}
              maxLength={600}
              rows={3}
              placeholder="For example, why does finished work take so long to become cash?"
              onChange={(e) => {
                setPriority(e.target.value);
                setPreview(false);
              }}
            />
            {siteIsLive ? (
              <a
                className="primary"
                href={enquiryEmailHref(service, business, priority)}
              >
                Open email draft <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <button className="primary" type="submit">
                Preview locally <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            )}
            <p className="form-note">
              {siteIsLive
                ? "Opening the email draft does not send it. Review and send in your email app. Inputs are not stored by this website."
                : "Nothing is submitted or saved. Inputs stay only in this page while it remains open."}
            </p>
          </form>
          {siteIsLive && (
            <p className="form-note">
              Or email{" "}
              <a className="text-link" href={`mailto:${enquiryEmail}`}>
                {enquiryEmail}
              </a>{" "}
              from your usual email app.
            </p>
          )}
          {!siteIsLive && preview && (
            <div className="local-preview" role="status">
              <strong>Your local enquiry outline</strong>
              <p>Interested in: {service}</p>
              {business && <p>Business: {business}</p>}
              {priority && <p>Question: {priority}</p>}
              <p className="small">
                Not sent. Enquiries will open once the contact route and offer
                details are confirmed.
              </p>
              <button className="text-link" onClick={() => setPreview(false)}>
                Close preview
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function BusinessHealthReview() {
  const [params] = useSearchParams();
  return (
    <div className="health pilot-page">
      <section className="wrap offer-hero">
        <div>
          <p className="eyebrow">The Revenue Leak Check</p>
          <h1>
            Follow the work.
            <br />
            <em>
              Find what needs
              <br />
              your attention.
            </em>
          </h1>
          <p className="intro">
            A focused review of where quoted work, delivery, invoicing and
            payment stop lining up. Built as a practical first step for
            founder-led service businesses.
          </p>
          <div className="actions">
            <Link className="primary" to="/business-health-review#scope">
              See the scope <ArrowDown size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/business-health-review#sample">
              View an illustrative output{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <aside className="offer-summary">
          <p className="eyebrow">One-off pilot</p>
          <p className="offer-price">
            ₹1,999<span>base fee</span>
          </p>
          <div className="offer-facts">
            <div>
              <strong>01</strong>
              <span>business entity</span>
            </div>
            <div>
              <strong>≤10</strong>
              <span>clean selected items</span>
            </div>
            <div>
              <strong>03</strong>
              <span>evidence-based priorities</span>
            </div>
          </div>
          <p>
            One page of findings, actions, owners and dates, with a short
            explanation and one clarification round.
          </p>
          <div className="price-review-note">
            Any applicable taxes, the final payable total and delivery date are
            confirmed before the engagement begins.
          </div>
          <Link className="text-link" to="/business-health-review#enquiry">
            Review enquiry details <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </aside>
      </section>
      <div className="principle-strip">
        <div className="wrap">
          <span>Quote</span>
          <ArrowUpRight size={17} aria-hidden="true" />
          <span>Delivery</span>
          <ArrowUpRight size={17} aria-hidden="true" />
          <span>Invoice</span>
          <ArrowUpRight size={17} aria-hidden="true" />
          <span>Payment</span>
        </div>
      </div>
      <section id="scope" className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Clear boundaries. Useful work.</p>
            <h2>
              A small, defined review.
              <br />
              <em>Not a business-wide audit.</em>
            </h2>
          </div>
          <p>
            The pilot examines the selected evidence. It does not certify
            accounts, determine a recoverable amount or promise revenue or
            profit improvements.
          </p>
        </div>
        <div className="scope-grid">
          <article>
            <span className="scope-symbol">
              <FileCheck2 size={24} />
            </span>
            <h3>What you provide</h3>
            <ul className="review-list">
              <li>
                One entity and up to 10 selected jobs, projects or service
                engagements.
              </li>
              <li>
                A clean standard input showing the quote or agreed scope,
                delivery status, invoiced amount and payment status.
              </li>
              <li>
                Relevant dates and known scope changes, plus supporting evidence
                for the selected items.
              </li>
              <li>
                One person who can clarify the records and own the next steps.
              </li>
            </ul>
            <p className="small">
              Records are shared only after scope, appropriate handling and a
              secure route are agreed. No upload is requested here.
            </p>
          </article>
          <article>
            <span className="scope-symbol">
              <Check size={24} />
            </span>
            <h3>What you receive</h3>
            <ul className="review-list">
              <li>A one-page review with three evidence-based priorities.</li>
              <li>
                What the records show, what is uncertain and what to check next.
              </li>
              <li>
                A practical action, owner and target date for each priority.
              </li>
              <li>A short explanation and one clarification round.</li>
            </ul>
            <p className="small">
              We agree the intake, explanation format and delivery date before
              work begins, once complete inputs and the scope are confirmed.
            </p>
          </article>
          <article className="scope-exclusions">
            <span className="scope-symbol">
              <CircleHelp size={24} />
            </span>
            <h3>What needs a separate scope</h3>
            <ul className="review-list">
              <li>Bookkeeping, reconciliation or custom cleanup.</li>
              <li>More entities, larger samples or new reporting systems.</li>
              <li>
                Implementation, collections outreach or ongoing operations.
              </li>
              <li>
                Tax, legal, statutory audit or regulated investment advice.
              </li>
            </ul>
            <p className="small">
              If the available information cannot support a useful check, agree
              a different approach before paid work begins.
            </p>
          </article>
        </div>
      </section>
      <section id="sample" className="sample-priorities section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Make the output tangible</p>
              <h2>
                A page your team
                <br />
                <em>can work from.</em>
              </h2>
            </div>
            <p>
              Illustrative example only. These are fictional findings for a
              service business, not a client case study or evidence of results.
            </p>
          </div>
          <div className="priority-sheet">
            <div className="sheet-heading">
              <div>
                <span className="eyebrow">Revenue Leak Check / Sample</span>
                <h3>Three priorities for the next review.</h3>
              </div>
              <span className="outline-label">Synthetic example</span>
            </div>
            <div className="priority-row">
              <span className="priority-number">01</span>
              <div>
                <span className="priority-category">Delivery → invoice</span>
                <h4>Check completed work awaiting billing.</h4>
                <p>
                  Example evidence: a delivery completion record has no matching
                  invoice in the selected sample. Confirm acceptance and billing
                  conditions before raising one.
                </p>
              </div>
              <div className="priority-owner">
                <span>Suggested owner</span>
                <strong>Operations lead</strong>
                <span>Target</span>
                <strong>Within 3 working days*</strong>
              </div>
            </div>
            <div className="priority-row">
              <span className="priority-number">02</span>
              <div>
                <span className="priority-category">Quote → delivery</span>
                <h4>Resolve an undocumented scope change.</h4>
                <p>
                  Example evidence: delivery notes include work absent from the
                  quote. Confirm whether it was agreed and chargeable before
                  proposing a variation.
                </p>
              </div>
              <div className="priority-owner">
                <span>Suggested owner</span>
                <strong>Account lead</strong>
                <span>Target</span>
                <strong>Within 5 working days*</strong>
              </div>
            </div>
            <div className="priority-row">
              <span className="priority-number">03</span>
              <div>
                <span className="priority-category">Invoice → payment</span>
                <h4>Clarify one overdue payment status.</h4>
                <p>
                  Example evidence: the invoice due date has passed and the
                  tracker shows no receipt. Verify payment, dispute and
                  collection history before follow-up.
                </p>
              </div>
              <div className="priority-owner">
                <span>Suggested owner</span>
                <strong>Finance owner</strong>
                <span>Target</span>
                <strong>Next weekly review*</strong>
              </div>
            </div>
            <p className="sheet-footnote">
              *Example action dates only, not service turnaround commitments. No
              recoverable amount is assumed; validate each issue first.
            </p>
          </div>
        </div>
      </section>
      <section id="business-pulse" className="wrap section pulse-layout">
        <div>
          <p className="eyebrow">A separate, optional next step</p>
          <h2>
            Business Pulse.
            <br />
            <em>
              A monthly check-in
              <br />
              on what matters.
            </em>
          </h2>
          <p className="intro">
            Repeat the focused check and review progress on the priorities. Keep
            attention on the actions your team has agreed to own.
          </p>
          <p>
            Explicit opt-in only. The one-off pilot does not enrol you in a
            monthly service.
          </p>
        </div>
        <article className="pulse-card">
          <p className="offer-price">
            ₹1,999<span>per month · base fee</span>
          </p>
          <ul className="check-list">
            <li>
              <Check size={17} /> One entity; up to 10 clean selected items
            </li>
            <li>
              <Check size={17} /> Repeat review and updated priorities
            </li>
            <li>
              <Check size={17} /> Follow-through on the agreed actions
            </li>
            <li>
              <Check size={17} /> Up to 30 minutes of async follow-up in total
            </li>
          </ul>
          <p>
            Custom cleanup, implementation and broader consulting are separately
            scoped.
          </p>
          <div className="price-review-note">
            Before enrolment, we agree applicable taxes, the final payable
            total, service timing, payment and cancellation terms.
          </div>
          <Link className="text-link" to="/business-health-review#enquiry">
            Review the next step <ArrowUpRight size={17} />
          </Link>
        </article>
      </section>
      <section className="faq-section">
        <div className="wrap section">
          <p className="eyebrow">Before deciding</p>
          <h2>
            Good questions.
            <br />
            <em>Clear expectations.</em>
          </h2>
          <div className="faq">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <EnquiryPreview key={params.toString()} />
      <section className="wrap pilot-bottom">
        <p>Need broader help with business performance, growth or reporting?</p>
        <Link className="text-link" to="/businesses">
          Explore separately scoped advisory <ArrowUpRight size={17} />
        </Link>
      </section>
    </div>
  );
}
