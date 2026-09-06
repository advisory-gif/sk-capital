import { Link } from 'react-router-dom';
import Team from '@/sections/Team';
import '@/health.css';
const areas = [
['01','Revenue quality','Is growth making the business stronger?','Understand your revenue mix, customer concentration and the drivers behind repeat business.'],
['02','Profitability','Where do you really make money?','Examine pricing, direct costs and contribution by customer, product or segment.'],
['03','Cash & working capital','Why is cash tight when sales are up?','Connect collections, payments and inventory to the cash your business needs.'],
['04','Planning & decisions','What can the business afford next?','Compare the cash and margin implications of hiring, investment and expansion.'],
['05','Financial visibility','Which numbers need your attention?','Turn reporting, forecasts and management reviews into a useful decision-making rhythm.'],
];
export default function Home() {
return <div className="health">
<section className="health-hero wrap">
<div><p className="eyebrow">Your business financial health partner</p><h1>See the whole business.<br/><em>Know what comes next.</em></h1>
<p className="intro">Revenue, margins and cash tell a connected story. SK Capital helps you understand it, identify what needs attention and turn financial insight into practical decisions.</p>
<div className="actions"><Link className="primary" to="/business-health-review">Start your Business Health Review <span aria-hidden="true">↗</span></Link><a className="secondary" href="#process">How we work ↓</a></div>
<p className="small">For founders of growing businesses. Built around your priorities.</p></div>
<aside className="business-map" aria-label="Areas of business financial health"><p className="eyebrow">The questions behind the numbers</p><div className="map-center">Your business.<br/><span>One connected picture.</span></div>{[['Revenue','Quality of growth'],['Margin','Real contribution'],['Cash','Room to operate'],['Decisions','A clear next step']].map(([a,b])=><div className="map-row" key={a}><strong>{a}</strong><span>{b}</span><span aria-hidden="true">↗</span></div>)}<p className="small">Understand the connections. Prioritise the action.</p></aside>
</section>
<section className="signal-band"><div className="wrap"><p>Growing revenue.<br/><strong>But where is the cash?</strong></p><p>Plenty of reports.<br/><strong>But what needs to change?</strong></p><p>A bigger opportunity.<br/><strong>But can you fund it?</strong></p></div></section>
<section id="services" className="wrap section"><p className="eyebrow">What we help with</p><div className="section-heading"><h2>Financial clarity,<br/><em>across the business.</em></h2><p>We start with the question you need to answer. Models, MIS, forecasts and fractional CFO support are the tools we use to get there.</p></div><div className="area-list">{areas.map(([n,title,q,desc])=><article key={n}><span className="number">{n}</span><h3>{title}</h3><div><h4>{q}</h4><p>{desc}</p></div></article>)}</div></section>
<section id="process" className="process section"><div className="wrap"><p className="eyebrow">How we work</p><h2>First understand.<br/><em>Then act.</em></h2><div className="steps">{[['01','Start with a conversation','Tell us about the business, what feels unclear and the decisions ahead.'],['02','Agree what to examine','Define the questions, information and scope needed for a useful diagnosis.'],['03','Focus on what matters','Connect the findings to priorities and practical recommendations.'],['04','Build the right support','Agree a tailored proposal and the support needed to put decisions into practice.']].map(([n,t,d])=><article key={n}><span className="number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><Link className="secondary" to="/business-health-review">What to expect from your review ↗</Link></div></section>
<section className="wrap section work"><div><p className="eyebrow">From numbers to decisions</p><h2>See what a clearer<br/>picture looks like.</h2><p>Explore an illustrative financial model across revenue, profitability, cash flow and scenarios. A sample of the analysis—not a promise about your results.</p><Link className="secondary" to="/portfolio">Explore our sample work ↗</Link></div><img src="/images/hero-dashboard.jpg" alt="Illustrative financial dashboard" loading="lazy"/></section>
<Team/>
<section className="wrap section closing"><p className="eyebrow">Start with your business</p><h2>What needs<br/><em>your attention?</em></h2><p>You do not need all the answers before we talk. Bring the questions that matter to you.</p><Link className="primary" to="/business-health-review">Start your Business Health Review ↗</Link><a className="email" href="mailto:advisory@skcapital.co.in">advisory@skcapital.co.in</a></section>
</div>;
}

