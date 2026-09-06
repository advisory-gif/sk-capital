import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@/health.css';
const links = [['What we help with','/#services'],['How we work','/#process'],['For investors','/#investors'],['Our work','/portfolio'],['About','/#team']];
export default function Navbar() {
const [open,setOpen] = useState(false);
const location=useLocation();
useEffect(()=>{setOpen(false);},[location]);
return <header className="site-nav"><a className="skip-link" href="#main-content">Skip to content</a><div className="nav-inner"><Link className="wordmark" to="/">SK Capital <span>Advisory</span></Link><button className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="site-links" onClick={()=>setOpen(!open)}>{open?'Close ×':'Menu ☰'}</button><nav id="site-links" aria-label="Main navigation" className={open?'nav-links is-open':'nav-links'} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();}}}>{links.map(([label,url])=><Link key={url} to={url} onClick={()=>setOpen(false)}>{label}</Link>)}<Link className="nav-cta" to="/business-health-review" onClick={()=>setOpen(false)}>Discuss your business ↗</Link></nav></div></header>;
}


