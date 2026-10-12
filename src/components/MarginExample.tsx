import { Link } from 'react-router-dom';
import SampleVisual from '@/components/SampleVisual';
import { findSample } from '@/lib/samples';
import { sampleVisual } from '@/lib/sample-visuals';

export default function MarginExample() {
  const sample = findSample('margin-check')!;
  const model = sampleVisual(sample);
  return <section id="sample-output" aria-labelledby="sample-output-title" className="mt-10 rounded-lg border border-line bg-paper p-6 sm:p-8 lg:p-10">
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
      <div><p className="eyebrow">A fictional reading</p><h3 id="sample-output-title" className="font-display text-3xl leading-tight text-ink sm:text-4xl">See what three projects leave.</h3><p className="mt-4 text-base leading-relaxed text-soft">{sample.finding}</p><p className="mt-4 text-base leading-relaxed text-soft">Fictional example · Margin Check · USD. These are business figures, not service prices or a client result.</p><Link to="/samples" className="example-link mt-4">Explore all eight examples <span aria-hidden="true">→</span></Link></div>
      <SampleVisual model={model} />
    </div>
  </section>;
}
