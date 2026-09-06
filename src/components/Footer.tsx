import { Link } from 'react-router-dom';
import { openLeadMagnet } from './Layout';
export default function Footer(){
  return <footer className="health-footer"><div className="wrap"><div className="footer-grid"><div><Link className="wordmark" to="/">SK Capital<span>Advisory</span></Link><p>Strategic clarity. Applied AI.<br/>Better business decisions.</p><p>Management & strategy consulting for businesses, startups and the people who invest in them.</p></div><nav aria-label="Footer navigation"><Link to="/businesses">For businesses</Link><Link to="/startups">For startups</Link><Link to="/#investors">For investors</Link><Link to="/how-we-use-ai">Applied AI</Link><Link to="/#team">Our people</Link><Link to="/blog">Perspectives</Link><Link to="/portfolio">Sample work</Link><button onClick={openLeadMagnet}>Runway calculator</button><a href="mailto:advisory@skcapital.co.in">Email us</a><a href="https://linkedin.com/company/sk-capital">LinkedIn ↗</a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SK Capital</span><span>Understand your business. Reduce costs. Grow revenue.</span></div></div></footer>;
}


