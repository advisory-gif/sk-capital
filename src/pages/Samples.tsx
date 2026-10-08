import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { exampleCurrencyNote, findSample, formatExample, samples } from '@/lib/samples';
import type { ExampleTable, ServiceSample } from '@/lib/samples';
import SampleVisual from '@/components/SampleVisual';
import { sampleVisual } from '@/lib/sample-visuals';

function DataTable({ data, caption }: { data: ExampleTable; caption: string }) {
  return <div className="mt-5">
    <p className="text-sm text-ink mb-3">On smaller screens, scroll sideways to see the full table.</p>
    <div className="sample-table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="sample-table">
        <caption>{caption}</caption>
        <thead><tr>{data.columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>{data.rows.map((row, index) => <tr key={index}>{data.columns.map((column, columnIndex) => columnIndex === 0
          ? <th key={column.key} scope="row">{formatExample(row[column.key], column.format)}</th>
          : <td key={column.key}>{formatExample(row[column.key], column.format)}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {data.note && <p className="text-sm leading-relaxed text-ink mt-3">{data.note}</p>}
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
      <section className="sample-takeaway" aria-labelledby="finding-heading"><h2 id="finding-heading" className="sr-only">The takeaway</h2><p className="text-xl text-forest leading-relaxed">{model.takeaway}</p><p className="text-base text-ink leading-relaxed mt-4"><strong>Next step:</strong> {model.next}</p></section>
    </div>
    <details id="sample-details" className="sample-more">
      <summary>Show details <span>Common questions and supporting numbers</span></summary>
      <div className="sample-details-body">
        <section aria-labelledby="explanations-heading" className="max-w-4xl">
          <h2 id="explanations-heading" className="font-display text-2xl mb-4">Common questions</h2>
          {sample.qa.map(qa => <details key={qa.question} className="sample-disclosure"><summary>{qa.question}</summary><p className="text-ink leading-relaxed mt-4">{qa.answer}</p></details>)}
        </section>
        {sample.draftCommentary && <details className="sample-disclosure mt-6"><summary>See a sample draft</summary><p className="text-sm text-ink mt-4">Prewritten example, not a live AI chat. A person must check any real draft.</p><p className="text-ink leading-relaxed mt-4">{sample.draftCommentary}</p></details>}
        <details className="sample-disclosure mt-6"><summary>See the numbers and assumptions</summary>
          <p className="text-sm text-ink leading-relaxed mt-4">{exampleCurrencyNote}</p>
          <DataTable data={sample.inputs} caption={sample.inputLabel} />
          <h3 className="font-display text-2xl mt-8">{sample.scenario.title}</h3><p className="text-ink leading-relaxed mt-3">{sample.scenario.description}</p><DataTable data={sample.scenario} caption={sample.scenario.title} />
          <details className="sample-disclosure mt-6"><summary>Check the calculations</summary><ul className="list-disc pl-5 mt-4 space-y-3 text-ink leading-relaxed">{sample.calculationNotes.map(note => <li key={note}>{note}</li>)}</ul></details>
        </details>
        <details className="sample-disclosure"><summary>What this service covers</summary>
          <p className="text-ink leading-relaxed mt-4">{sample.scope}</p><ul className="list-disc pl-5 space-y-3 mt-4 text-ink leading-relaxed">{sample.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
          <ul className="list-disc pl-5 space-y-3 mt-5 text-sm text-ink leading-relaxed">{sample.cautions.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="text-sm text-ink leading-relaxed mt-5">Fictional examples, not client results or guaranteed outcomes. Not audit, tax, legal or investment advice.</p>
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
    <header className="max-w-3xl"><p className="eyebrow">See the work</p><h1 tabIndex={-1} className="section-title">A business question.<br />A few numbers. A clearer next step.</h1><p className="text-lg text-ink leading-relaxed mt-6">One question. One visual. One useful takeaway.</p><p className="text-sm text-ink leading-relaxed mt-5">Fictional examples in US dollars (USD), not service prices.</p></header>
    <div className="grid md:grid-cols-2 gap-x-12 mt-10">{samples.map((item, index) => <article key={item.id} className="py-8 border-t border-forest/20"><p className="text-sm font-semibold text-forest mb-3">0{index + 1} · {item.category}</p><h2 className="font-display text-3xl">{item.question}</h2><p className="text-base font-semibold mt-4">{item.name}</p><Link to={`/samples/${item.id}`} className="example-link mt-5" aria-label={`See an example of ${item.name}`}>See the example <ArrowRight size={16} aria-hidden="true" /></Link></article>)}</div>
    <p className="text-sm text-ink leading-relaxed mt-6 max-w-3xl">The first three examples illustrate starter scopes. AI Finance Workflow Setup covers one defined workflow. Tailored projects receive a separate quote, with deliverables, timing and fees agreed after a conversation.</p>
  </section>;
}
