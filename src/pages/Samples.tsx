import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { exampleCurrencyNote, findSample, formatExample, samples } from '@/lib/samples';
import type { ExampleTable, ServiceSample } from '@/lib/samples';

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
  return <article className="content-width py-10 sm:py-14 lg:py-16">
    <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10">
      <Link to="/samples" className="example-link"><ArrowLeft size={16} aria-hidden="true" /> All examples</Link>
      <Link to={`/#${returnSection}`} className="example-link">Back to services</Link>
    </div>
    <header className="max-w-4xl">
      <p className="eyebrow">Fictional example · {sample.category}</p>
      <p className="font-ui text-base font-semibold text-forest mb-4">{sample.name}</p>
      <h1 tabIndex={-1} className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight">{sample.question}</h1>
      <p className="text-lg text-ink leading-relaxed mt-6">{sample.problem}</p>
      <p className="text-sm text-ink leading-relaxed mt-5">{exampleCurrencyNote}</p>
    </header>
    <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 my-8 border-y border-forest/20">
      {sample.metrics.map(metric => <div key={metric.label}><dt className="text-base text-ink">{metric.label}</dt><dd className="font-display text-4xl text-forest mt-3">{formatExample(metric.value, metric.format)}</dd>{metric.detail && <dd className="text-sm text-ink leading-relaxed mt-2">{metric.detail}</dd>}</div>)}
    </dl>
    <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
      <section aria-labelledby="finding-heading"><h2 id="finding-heading" className="font-display text-3xl">What the numbers show</h2><p className="text-ink text-lg leading-relaxed mt-4">{sample.finding}</p></section>
      <section aria-labelledby="next-step-heading" className="bg-sand p-6 border-l-2 border-lime"><h2 id="next-step-heading" className="font-display text-3xl">A practical next step</h2><p className="text-ink leading-relaxed mt-4">{sample.nextStep}</p></section>
    </div>
    <section aria-labelledby="explanations-heading" className="mt-12 max-w-4xl">
      <h2 id="explanations-heading" className="font-display text-3xl">Make sense of the example</h2>
      <p className="text-sm text-ink leading-relaxed mt-3 mb-5">Prewritten explanations, not live AI. Open a question to read the answer. Nothing is submitted or generated.</p>
      {sample.qa.map(qa => <details key={qa.question} className="sample-disclosure"><summary>{qa.question}</summary><p className="text-ink leading-relaxed mt-4">{qa.answer}</p></details>)}
    </section>
    {sample.draftCommentary && <section aria-labelledby="draft-heading" className="mt-10 max-w-4xl bg-sand p-6 sm:p-8"><p className="eyebrow">Prewritten demonstration</p><h2 id="draft-heading" className="font-display text-3xl">Example commentary draft</h2><p className="text-ink leading-relaxed mt-4">{sample.draftCommentary}</p><p className="text-sm text-ink leading-relaxed mt-4">This stored example does not call an AI model or connect to your files. Any real output requires human review.</p></section>}
    <section aria-labelledby="details-heading" className="mt-12">
      <h2 id="details-heading" className="font-display text-3xl mb-5">Look under the numbers</h2>
      <details className="sample-disclosure"><summary>Inputs and assumptions</summary><DataTable data={sample.inputs} caption={sample.inputLabel} /></details>
      <details className="sample-disclosure"><summary>{sample.scenario.title}</summary><p className="text-ink leading-relaxed mt-4">{sample.scenario.description}</p><DataTable data={sample.scenario} caption={sample.scenario.title} /></details>
      <details className="sample-disclosure"><summary>How the figures are calculated</summary><ul className="list-disc pl-5 mt-4 space-y-3 text-ink leading-relaxed">{sample.calculationNotes.map(note => <li key={note}>{note}</li>)}</ul></details>
    </section>
    <section aria-labelledby="scope-heading" className="mt-10 grid md:grid-cols-2 gap-8 lg:gap-12 border-b border-forest/20 pb-10">
      <div><h2 id="scope-heading" className="font-display text-3xl">What this illustrates</h2><p className="text-ink leading-relaxed mt-4">{sample.scope}</p><ul className="list-disc pl-5 space-y-3 mt-4 text-ink leading-relaxed">{sample.deliverables.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div><h3 className="font-display text-2xl">Keep in mind</h3><ul className="list-disc pl-5 space-y-3 mt-4 text-ink leading-relaxed">{sample.cautions.map(item => <li key={item}>{item}</li>)}</ul><p className="text-sm text-ink leading-relaxed mt-5">All businesses and figures are fictional. These are not client results, forecasts for a real business or guaranteed outcomes. Findings depend on the stated inputs and assumptions. This is not audit, tax, legal or investment advice.</p></div>
    </section>
    <div className="flex flex-wrap items-center gap-6 mt-8"><Link to="/samples" className="button-secondary">Explore another example <ArrowRight size={16} aria-hidden="true" /></Link><Link to={`/#${returnSection}`} className="example-link">Back to services and scope</Link></div>
  </article>;
}

export default function Samples() {
  const { sampleId } = useParams();
  const sample = findSample(sampleId);
  if (sample) return <SampleDetail key={sample.id} sample={sample} />;
  if (sampleId) return <section className="content-width section-space"><p className="eyebrow">Example not found</p><h1 tabIndex={-1} className="section-title">Let’s find the right example.</h1><p className="text-ink mt-5 mb-8">This example link is not available. You can browse all eight services below.</p><Link to="/samples" className="button-primary">See all examples <ArrowRight size={16} aria-hidden="true" /></Link></section>;
  return <section className="content-width section-space">
    <Link to="/#services" className="example-link mb-8"><ArrowLeft size={16} aria-hidden="true" /> Back to services</Link>
    <header className="max-w-3xl"><p className="eyebrow">See the work</p><h1 tabIndex={-1} className="section-title">A business question.<br />A few numbers. A clearer next step.</h1><p className="text-lg text-ink leading-relaxed mt-6">Explore a simple example for each service. Start with the finding, then open the explanations and calculations if you want to look closer.</p><p className="text-sm text-ink leading-relaxed mt-5">All eight examples are fictional, not client results. {exampleCurrencyNote} Explanations are prewritten, not live AI.</p></header>
    <div className="grid md:grid-cols-2 gap-x-12 mt-10">{samples.map((item, index) => <article key={item.id} className="py-8 border-t border-forest/20"><p className="text-sm font-semibold text-forest mb-3">0{index + 1} · {item.category}</p><h2 className="font-display text-3xl">{item.question}</h2><p className="text-base font-semibold mt-4">{item.name}</p><p className="text-ink leading-relaxed mt-3">{item.problem}</p><Link to={`/samples/${item.id}`} className="example-link mt-5" aria-label={`See an example of ${item.name}`}>See the example <ArrowRight size={16} aria-hidden="true" /></Link></article>)}</div>
    <p className="text-sm text-ink leading-relaxed mt-6 max-w-3xl">The first three examples illustrate starter scopes. AI Finance Workflow Setup covers one defined workflow. Tailored projects receive a separate quote, with deliverables, timing and fees agreed after a conversation.</p>
  </section>;
}
