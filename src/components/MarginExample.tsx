const revenue = 50000;
const directCosts = 38000;
const extraDeliveryCost = 5000;
const contribution = revenue - directCosts;
const scenarioContribution = contribution - extraDeliveryCost;
const amount = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const margin = (value: number) => `${Math.round(value / revenue * 100)}%`;

export default function MarginExample() {
  return <section id="sample-output" aria-labelledby="sample-output-title" className="mt-12 border border-forest/15 bg-white p-6 sm:p-8 lg:p-10">
    <div className="grid lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-12">
      <div>
        <p className="eyebrow">What you receive</p>
        <h3 id="sample-output-title" className="font-display text-3xl sm:text-4xl leading-tight text-forest">See what one project leaves.</h3>
        <p className="text-sm text-ink leading-relaxed mt-4">A Margin Check turns the prices and direct costs you provide into a comparison, one scenario and a short summary of questions to investigate.</p>
        <p className="text-xs text-ink leading-relaxed mt-5">This fictional excerpt shows the format. It is not a client result or a full business review.</p>
      </div>
      <div>
        <p className="font-ui text-xs font-semibold tracking-wide text-forest mb-5">Fictional example · Margin Check · INR</p>
        <dl className="grid sm:grid-cols-3 gap-5 border-y border-forest/15 py-5">
          <div><dt className="text-xs text-ink">Project revenue</dt><dd className="font-display text-3xl text-forest mt-2">{amount(revenue)}</dd></div>
          <div><dt className="text-xs text-ink">Direct delivery costs</dt><dd className="font-display text-3xl text-forest mt-2">{amount(directCosts)}</dd></div>
          <div><dt className="text-xs text-ink">Contribution</dt><dd className="font-display text-3xl text-forest mt-2">{amount(contribution)}<span className="block font-ui text-xs mt-2">{margin(contribution)} of revenue</span></dd></div>
        </dl>
        <p className="text-xs text-ink leading-relaxed mt-4">Direct delivery costs here are freelancer fees and project-specific software. Contribution is revenue less those costs, before shared overheads and tax. It is not net profit.</p>
        <div className="mt-6 pl-5 border-l-2 border-lime">
          <h4 className="font-ui font-semibold text-sm text-forest">What if delivery costs rise?</h4>
          <p className="text-sm text-ink leading-relaxed mt-2">An extra {amount(extraDeliveryCost)} of direct delivery cost would reduce contribution to {amount(scenarioContribution)} ({margin(scenarioContribution)}), if revenue stays the same.</p>
        </div>
        <div className="mt-6">
          <h4 className="font-ui font-semibold text-sm text-forest">A question to take back to the business</h4>
          <p className="text-sm text-ink leading-relaxed mt-2">Is revision time included in the quoted scope and recorded delivery cost?</p>
        </div>
      </div>
    </div>
  </section>;
}
