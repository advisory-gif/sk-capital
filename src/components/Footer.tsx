import { Link } from 'react-router-dom';
import { openLeadMagnet } from './Layout';
export default function Footer(){return <footer className="health-footer"><div className="wrap"><div><Link className="wordmark" to="/">SK Capital <span>Advisory</span></Link><p>Management & strategy consulting through a financial lens.</p></div><nav aria-label="Footer navigation"><Link to="/blog">Insights</Link><Link to="/how-we-use-ai">How we use AI</Link><button onClick={openLeadMagnet}>Runway calculator</button><a href="mailto:advisory@skcapital.co.in">Email</a><a href="https://linkedin.com/company/sk-capital">LinkedIn</a></nav><p>© {new Date().getFullYear()} SK Capital</p></div></footer>;}


