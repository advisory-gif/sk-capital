import { Link } from 'react-router-dom';

const content = {
  business: {
    label: 'For established businesses',
    title: 'Build on your strengths.',
    emphasis: 'Improve what holds you back.',
    intro: 'Management and strategy consulting for small and medium-sized businesses. Understand profitability, control costs and assess the next stage of growth through a financial lens.',
    question: 'Revenue is growing. Is the business getting stronger?',
    context: 'A business with an established customer base needs a clear view of what earns a return, what ties up cash and where resources could work harder. We connect financial performance with the way the business operates.',
    areas: [
      ['Profitability & pricing', 'Understand margins by product, customer or channel. Examine pricing and the cost to serve, so growth contributes to the business.'],
      ['Costs & resource allocation', 'Review operating expenditure, headcount and capacity. Prioritise efficiency opportunities in the context of your goals.'],
      ['Cash & working capital', 'Connect collections, supplier payments and inventory, where relevant, to the cash needed for day-to-day operations and growth.'],
      ['Sales & growth strategy', 'Assess channel performance, marketing expenditure and expansion choices against the economics of the business.'],
      ['Planning & management review', 'Set budgets, compare scenarios and review actual performance. Agree when a change of direction is needed.'],
    ],
    measures: ['Customer & product margins', 'Operating costs & EBITDA', 'Collections & cash conversion', 'Channel contribution', 'Capacity & headcount costs'],
    outputs: ['A diagnosis of performance and its underlying drivers.', 'A prioritised plan with actions and responsibilities.', 'Budgets or scenarios for the decisions in scope.', 'An agreed review rhythm to track progress with your team.'],
    cta: 'Discuss your business priorities',
  },
  startup: {
    label: 'For startups',
    title: 'Know what drives growth.',
    emphasis: 'Make every stage count.',
    intro: 'Metrics, reporting and financial planning for startup founders. Build a clear view of runway, growth efficiency and performance so you can make informed decisions about the next stage.',
    question: 'You are moving fast. Are the numbers keeping up?',
    context: 'A startup needs to test assumptions while managing limited resources. We help build a reporting and planning rhythm that connects the business model, growth experiments and the cash available.',
    areas: [
      ['Metrics & management reporting', 'Define the KPIs that fit your stage and business model. Build consistent MIS and a review of what changed and why.'],
      ['Burn, runway & cash planning', 'Understand net cash burn and forecast funding needs. Assess how hiring, spending and revenue assumptions affect runway.'],
      ['Unit economics & growth efficiency', 'Examine acquisition cost, retention, contribution and payback where meaningful. Use recurring revenue metrics for subscription models, rather than applying one template to every startup.'],
      ['Forecasting & scenario planning', 'Connect revenue assumptions, operating expenses and headcount in a financial plan. Compare choices before committing resources.'],
      ['Investor & board reporting', 'Bring metrics, financial performance and commentary into a consistent reporting pack that helps explain the business and the decisions ahead.'],
    ],
    measures: ['Burn & runway', 'Contribution & unit economics', 'Acquisition cost & payback', 'Retention & repeat revenue', 'Plan versus actual performance'],
    outputs: ['A focused KPI framework and management reporting pack.', 'A financial model with assumptions and scenarios.', 'A clear view of cash needs and spending choices.', 'Regular reviews that connect the metrics to founder decisions.'],
    cta: 'Discuss your startup',
  },
};

export default function Audience({kind}:{kind:'business'|'startup'}) {
  const c=content[kind];
  return <div className="health">
    <section className="wrap section review-hero"><p className="eyebrow">{c.label}</p><h1>{c.title}<br/><em>{c.emphasis}</em></h1><p className="intro">{c.intro}</p><Link className="primary" to={'/business-health-review?audience='+kind}>{c.cta} ↗</Link></section>
    <section className="wrap impact-band"><h2>{c.question}</h2><p>{c.context}</p></section>
    <section className="wrap section"><div className="section-heading"><div><p className="eyebrow">Support that fits your stage</p><h2>Where we can help.</h2></div><p>Start with the decision you need to make. We agree the scope around your priorities and the information available.</p></div><div className="area-list">{c.areas.map(([t,d],i)=><article key={t}><span className="number">0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section className="process section"><div className="wrap review-grid"><div><p className="eyebrow">A useful view of performance</p><h2>The measures follow<br/><em>the business model.</em></h2><p className="intro">We select relevant measures together and establish what the underlying information can reliably tell us.</p><div className="metric-tags">{c.measures.map(m=><span key={m}>{m}</span>)}</div></div><aside className="review-note"><p className="eyebrow">What the work can produce</p><ul className="review-list">{c.outputs.map(o=><li key={o}>{o}</li>)}</ul></aside></div></section>
    <section className="wrap section"><div className="section-heading"><h2>Your team.<br/><em>Our guidance.</em></h2><p>We analyse, recommend and guide implementation. Your team owns execution. Where ongoing support is agreed, we review results together and recommend adjustments.</p></div><Link className="text-link" to={kind==='business'?'/startups':'/businesses'}>{kind==='business'?'Looking for startup metrics and reporting?':'Looking for established business consulting?'} ↗</Link></section>
    <section className="closing"><div className="wrap"><p className="eyebrow">Start with a conversation</p><h2>Bring the questions<br/>that matter to you.</h2><Link className="primary" to={'/business-health-review?audience='+kind}>{c.cta} ↗</Link></div></section>
  </div>;
}
