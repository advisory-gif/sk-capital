import { Link } from 'react-router-dom';
import Team from '@/sections/Team';
import '@/health.css';

const steps = [
  ['01', 'Understand', 'Your goals, business model, team and available information set the agenda.'],
  ['02', 'Diagnose', 'Connect commercial and financial performance to understand what needs attention.'],
  ['03', 'Prioritise', 'Agree practical actions, responsibilities and measures of progress.'],
  ['04', 'Guide', 'Work alongside your team as they put the plan into practice.'],
  ['05', 'Review & adapt', 'Check the results and adjust the approach as the business evolves.'],
];

function StrategyVisual() {
  return <svg className="strategy-visual" viewBox="0 0 1400 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="landscape" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#092c22"/><stop offset=".55" stopColor="#1b6549"/><stop offset="1" stopColor="#aedbaa"/></linearGradient>
      <linearGradient id="ribbon" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#174737"/><stop offset=".6" stopColor="#84bc83"/><stop offset="1" stopColor="#e4f7ba"/></linearGradient>
      <radialGradient id="light"><stop stopColor="#e6f8cf" stopOpacity=".6"/><stop offset="1" stopColor="#e6f8cf" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1400" height="660" fill="url(#landscape)"/>
    <ellipse cx="1110" cy="80" rx="470" ry="330" fill="url(#light)"/>
    <g fill="none" stroke="url(#ribbon)" strokeWidth="65">
      <path d="M600 780V370C600 40 920 40 920 370V780"/>
      <path d="M790 790V300C790 -30 1110 -30 1110 300V790"/>
      <path d="M980 790V230C980 -100 1300 -100 1300 230V790"/>
      <path d="M1170 790V160C1170 -170 1490 -170 1490 160V790"/>
    </g>
    <g fill="none" stroke="#e4f7ba" strokeOpacity=".3"><path d="M0 650L1400 430M0 590L1400 370M0 530L1400 310"/><path d="M440 660L1210 0M680 660L1400 40M940 660L1400 250"/></g>
    <circle cx="1098" cy="302" r="8" fill="#dcf4b8"/><circle cx="914" cy="367" r="5" fill="#dcf4b8"/>
  </svg>;
}

export default function Home() {
  return <div className="health">
    <section className="masthead wrap">
      <p className="eyebrow">Welcome to SK Capital</p>
      <h1>Strategic clarity. Applied AI.<br/><em>Better business decisions.</em></h1>
      <p>Management & strategy consulting through a financial lens.</p>
    </section>
    <section className="feature wrap" aria-labelledby="feature-title">
      <StrategyVisual/>
      <span className="feature-tag">For businesses. For startups. For what comes next.</span>
      <div className="feature-card"><p className="eyebrow">The SK Capital approach</p>
        <h2 id="feature-title">Understand your business.<br/>Reduce costs.<br/>Grow revenue.</h2>
        <p>Connect the numbers to the decisions that matter. We help you identify opportunities, build a practical plan and guide your team as it takes shape.</p>
        <Link className="primary" to="/business-health-review">Discuss your business <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
    <nav className="spotlight" aria-label="Explore our services"><span>Find your focus</span><Link to="/businesses">Established businesses ↗</Link><Link to="/startups">Startups ↗</Link><a href="#investors">Investors ↗</a></nav>
    <section id="services" className="wrap section">
      <div className="section-heading"><div><p className="eyebrow">Different stages. Different questions.</p><h2>Advice shaped around<br/><em>your business.</em></h2></div><p>An established business improving profitability and a startup finding a repeatable growth model need different support. We start with your stage, your priorities and the decisions ahead.</p></div>
      <div className="audience-grid">
        <article className="audience-card established"><p className="eyebrow">For established businesses</p><h3>Make a stronger business<br/>of what you have built.</h3><p>Understand margins, manage costs, release cash and assess where growth will create value.</p><ul><li>Business performance & profitability</li><li>Cost management & resource allocation</li><li>Working capital & growth strategy</li></ul><Link className="text-link" to="/businesses">Explore business consulting <span aria-hidden="true">↗</span></Link></article>
        <article className="audience-card startup"><p className="eyebrow">For startups</p><h3>Know your metrics.<br/>Plan your next stage.</h3><p>Build visibility into runway, unit economics and performance, with reporting that supports founder and investor decisions.</p><ul><li>Metrics, MIS & investor reporting</li><li>Burn, runway & financial planning</li><li>Unit economics & growth efficiency</li></ul><Link className="text-link" to="/startups">Explore startup support <span aria-hidden="true">↗</span></Link></article>
      </div>
    </section>
    <section className="wrap impact-band"><h2>Ambition needs direction.<br/>Progress needs follow-through.</h2><div><p>We work with your existing team to turn analysis into action. Your team owns execution; we provide recommendations, guide decisions and review whether the strategy is working.</p><a className="primary" href="#process">See how we work ↗</a></div></section>
    <section className="wrap section ai-feature"><div className="ai-orbit" aria-hidden="true"><span>AI</span><i/><i/><i/></div><div><p className="eyebrow">Applied AI. Human judgement.</p><h2>More time for<br/><em>the decisions that matter.</em></h2><p className="intro">AI can help organise information, explore patterns and prepare analysis. We bring the business context, challenge assumptions and review the recommendations.</p><Link className="text-link" to="/how-we-use-ai">Explore our approach to AI ↗</Link></div></section>
    <section id="process" className="process section"><div className="wrap"><p className="eyebrow">From understanding to action</p><h2>A clear plan.<br/><em>A continuing conversation.</em></h2><div className="steps">{steps.map(([n,t,d])=><article key={n}><span className="number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><Link className="text-link" to="/business-health-review">What to expect from the first conversation ↗</Link></div></section>
    <section id="investors" className="wrap section"><div className="section-heading"><div><p className="eyebrow">For investors</p><h2>Assess the opportunity.<br/><em>Support the founders.</em></h2></div><p>Commercial and financial analysis before an investment, and practical support for portfolio-company performance. The questions and scope are agreed for each engagement.</p></div><div className="audience-grid"><article className="plain-card"><span className="number">01 / Before investment</span><h3>Investment assessment</h3><p>Examine the business, its performance and the assumptions behind the opportunity. Define the analysis around the questions you need answered.</p><Link className="text-link" to="/business-health-review?audience=investor">Discuss an assessment ↗</Link></article><article className="plain-card"><span className="number">02 / After investment</span><h3>Portfolio-company support</h3><p>Help founders prioritise improvements, give their teams direction and track whether the agreed actions are producing progress.</p><Link className="text-link" to="/business-health-review?audience=investor">Discuss portfolio support ↗</Link></article></div></section>
    <Team/>
    <section className="wrap section"><div className="section-heading"><div><p className="eyebrow">Explore further</p><h2>Bring clarity<br/><em>to the next conversation.</em></h2></div></div><div className="audience-grid"><Link className="resource-card" to="/portfolio"><span className="eyebrow">Illustrative analysis</span><h3>From business assumptions<br/>to financial scenarios.</h3><span className="text-link">Explore sample work ↗</span></Link><Link className="resource-card" to="/blog"><span className="eyebrow">Perspectives</span><h3>Questions worth asking<br/>about your business.</h3><span className="text-link">Explore our thinking ↗</span></Link></div></section>
    <section className="closing"><div className="wrap"><p className="eyebrow">Your next chapter</p><h2>What would you like<br/>your business to achieve?</h2><p>Bring your goals, your questions and the decisions ahead.</p><Link className="primary" to="/business-health-review">Let’s talk ↗</Link></div></section>
  </div>;
}
