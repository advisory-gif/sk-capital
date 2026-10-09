import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { exampleCurrencyNote, findSample, formatExample, samples } from '@/lib/samples';
import type { ExampleTable, ServiceSample } from '@/lib/samples';
import SampleVisual from '@/components/SampleVisual';
import SamplePreview from '@/components/SamplePreview';
import { sampleVisual } from '@/lib/sample-visuals';

function DataTable({ data, caption }: { data: ExampleTable; caption: string }) {
  return <div className="mt-5">
    <p className="text-base text-ink mb-3">On smaller screens, scroll sideways to see the full table.</p>
    <div className="sample-table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="sample-table">
        <caption>{caption}</caption>
        <thead><tr>{data.columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>{data.rows.map((row, index) => <tr key={index}>{data.columns.map((column, columnIndex) => columnIndex === 0
          ? <th key={column.key} scope="row">{formatExample(row[column.key], column.format)}</th>
          : <td key={column.key}>{formatExample(row[column.key], column.format)}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {data.note && <p className="text-base leading-relaxed text-ink mt-3">{data.note}</p>}
  </div>;
}

function SampleDetail({ sample }: { sample: ServiceSample }) {
  const returnSection = sample.category === 'Tailored project' ? 'custom-projects' : 'services';
  const model = sampleVisual(sample);
  return <article className="content-width sample-page">
    <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6">
      <Link to="/samples" className="example-link"><ArrowLeft size={16} aria-hidden="true" /> All examples</Link>
      <Link to={`/#${returnSection}`} className="example-link">Back to services</Link>
    </div>
    <div className="sample-overview">
      <header className="sample-question">
        <p className="eyebrow">{sample.name}</p>
        <h1 tabIndex={-1} className="font-display text-4xl sm:text-5xl leading-[1.06] tracking-tight">{sample.question}</h1>
        <p className="sample-short-disclaimer">Fictional example · US dollars (USD), not service prices</p>
      </header>
      <SampleVisual model={model} />
      <p className="sample-takeaway"><span>The next step</span>{sample.takeaway}</p>
    </div>
    <details id="sample-details" className="sample-more">
      <summary>See the details <span>Numbers, assumptions and scope</span></summary>
      <div className="sample-details-body">
        <div className="sample-story">
          {[['What happened', sample.finding], ['Why it matters', sample.meaning], ['What to check', sample.nextStep]].map(([heading, text]) => <section className="sample-story-point" key={heading}><h2>{heading}</h2><p>{text}</p></section>)}
        </div>
        <section aria-labelledby="explanations-heading" className="max-w-4xl mt-8">
          <h2 id="explanations-heading" className="font-display text-2xl mb-4">Common questions</h2>
          {sample.qa.map(qa => <details key={qa.question} className="sample-disclosure"><summary>{qa.question}</summary><p className="text-ink leading-relaxed mt-4">{qa.answer}</p></details>)}
        </section>
        {sample.draftCommentary && <details className="sample-disclosure mt-6"><summary>See a sample draft</summary><p className="text-base text-ink mt-4">Prewritten example, not a live AI chat. A person must check any real draft.</p><p className="text-ink leading-relaxed mt-4">{sample.draftCommentary}</p></details>}
        <details className="sample-disclosure mt-6"><summary>See the numbers and assumptions</summary>
          <p className="text-base text-ink leading-relaxed mt-4">{exampleCurrencyNote}</p>
          <DataTable data={sample.inputs} caption={sample.inputLabel} />
          <h3 className="font-display text-2xl mt-8">{sample.scenario.title}</h3><p className="text-ink leading-relaxed mt-3">{sample.scenario.description}</p><DataTable data={sample.scenario} caption={sample.scenario.title} />
          <details className="sample-disclosure mt-6"><summary>Check the calculations</summary><ul className="list-disc pl-5 mt-4 space-y-3 text-ink leading-relaxed">{sample.calculationNotes.map(note => <li key={note}>{note}</li>)}</ul></details>
        </details>
        <details className="sample-disclosure sample-service-scope"><summary>What this service covers</summary>
          <p className="text-ink leading-relaxed mt-4">{sample.scope}</p><ul className="list-disc pl-5 space-y-3 mt-4 text-ink leading-relaxed">{sample.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
          <ul className="list-disc pl-5 space-y-3 mt-4 text-base text-ink leading-relaxed">{sample.cautions.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="text-base text-ink leading-relaxed mt-4">Fictional examples, not client results or guaranteed outcomes. Not audit, tax, legal or investment advice.</p>
        </details>
      </div>
    </details>
    <div className="flex flex-wrap items-center gap-6 mt-6"><Link to="/samples" className="button-secondary">Explore another example <ArrowRight size={16} aria-hidden="true" /></Link><Link to={`/#${returnSection}`} className="example-link">Back to services and scope</Link></div>
  </article>;
}

export default function Samples() {
  const { sampleId } = useParams();
  const sample = findSample(sampleId);
  if (sample) return <SampleDetail key={sample.id} sample={sample} />;
  if (sampleId) return <section className="content-width section-space"><p className="eyebrow">Example not found</p><h1 tabIndex={-1} className="section-title">Let’s find the right example.</h1><p className="text-ink mt-5 mb-8">This example link is not available. You can browse all eight services below.</p><Link to="/samples" className="button-primary">See all examples <ArrowRight size={16} aria-hidden="true" /></Link></section>;
  return <section className="content-width section-space">
    <Link to="/#services" className="example-link mb-8"><ArrowLeft size={16} aria-hidden="true" /> Back to services</Link>
    <header className="max-w-3xl"><p className="eyebrow">See the work</p><h1 tabIndex={-1} className="section-title">Real business questions.<br />Simple examples.</h1><p className="text-base text-ink leading-relaxed mt-5">Fictional examples in US dollars (USD), not client results or service prices.</p></header>
    <div className="sample-gallery">{samples.map((item, index) => <article key={item.id} className="sample-card">
      <p className="sample-card-service">0{index + 1} · {item.name}</p>
      <h2 className="font-display text-3xl">{item.question}</h2>
      <SamplePreview sample={item} />
      <Link to={`/samples/${item.id}`} className="example-link" aria-label={`See an example of ${item.name}`}>See the example <ArrowRight size={16} aria-hidden="true" /></Link>
    </article>)}</div>
  </section>;
}
