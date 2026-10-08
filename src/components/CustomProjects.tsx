import { Link } from 'react-router-dom';
import { bookingUrl, enquiryUrl } from '@/lib/offers';

import { customCapabilities } from '@/lib/advisory';

export default function CustomProjects() {
  return <section data-reveal id="custom-projects" className="section-space border-b border-forest/15">
    <div className="content-width">
      <p className="eyebrow">Larger, tailored projects</p>
      <h2 className="section-title">Need more than a starting point?</h2>
      <p className="text-ink leading-relaxed mt-5 max-w-2xl">For a broader business question, we shape the analysis, planning or reporting work around your decision, existing tools and available data.</p>
      <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-8 mt-10">
        {customCapabilities.map(([title, description, sampleId]) => <li key={title}>
          <h3 className="font-display text-2xl text-forest">{title}</h3>
          <p className="text-base text-ink leading-relaxed mt-3">{description}</p>
          <Link to={`/samples/${sampleId}`} className="example-link mt-4" aria-label={`See an example of ${title}`}>See an example <span aria-hidden="true">↗</span></Link>
        </li>)}
      </ul>
      <p className="text-base text-ink leading-relaxed mt-10 max-w-2xl">Each tailored project is quoted separately. Scope, deliverables, timeline and fees are agreed after a conversation. Any tool, integration or access requirements are confirmed before work begins.</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-6">
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-secondary">Discuss your project</a>
        <a href={enquiryUrl('Custom business performance project enquiry')} className="text-base text-ink hover:text-forest">Email your project outline</a>
      </div>
    </div>
  </section>;
}
