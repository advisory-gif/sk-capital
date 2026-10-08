import { Link } from 'react-router-dom';
import SampleVisual from '@/components/SampleVisual';
import { findSample } from '@/lib/samples';
import { sampleVisual } from '@/lib/sample-visuals';

export default function MarginExample() {
  const sample = findSample('margin-check')!;
  const model = sampleVisual(sample);
  return <section id="sample-output" aria-labelledby="sample-output-title" className="mt-12 border border-forest/15 bg-white p-6 sm:p-8 lg:p-10">
    <div className="grid lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-12 items-center">
      <div><p className="eyebrow">See the work</p><h3 id="sample-output-title" className="font-display text-3xl sm:text-4xl leading-tight text-forest">See what one project leaves.</h3><p className="text-lg text-ink leading-relaxed mt-4">{model.takeaway}</p><p className="text-sm text-ink leading-relaxed mt-4">Fictional example · Margin Check · INR. These are business figures, not service prices or a client result.</p><Link to="/samples" className="example-link mt-4">Explore all eight examples <span aria-hidden="true">→</span></Link></div>
      <SampleVisual model={model} />
    </div>
  </section>;
}
