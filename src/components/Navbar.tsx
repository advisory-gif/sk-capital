import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@/health.css';
const links=[['For businesses','/businesses'],['For startups','/startups'],['For investors','/#investors'],['How we work','/#process'],['Applied AI','/how-we-use-ai'],['Our people','/#team'],['Sample work','/portfolio'],['Perspectives','/blog'],['Discuss your business','/business-health-review']];
export default function Navbar(){
  const [open,setOpen]=useState(false);
  const toggle=useRef<HTMLButtonElement>(null);
  const location=useLocation();
  useEffect(()=>{setOpen(false);},[location]);
  useEffect(()=>{
    if(!open)return;
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}};
    document.addEventListener('keydown',onKey);
    return ()=>document.removeEventListener('keydown',onKey);
  },[open]);
  return <header className="site-nav"><a className="skip-link" href="#main-content">Skip to content</a><div className="nav-inner"><div className="nav-brand"><button ref={toggle} className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="site-links" onClick={()=>setOpen(!open)}><span aria-hidden="true">{open?'×':'☰'}</span></button><Link className="wordmark" to="/">SK Capital<span>Advisory</span></Link></div><nav className="nav-shortcuts" aria-label="Quick navigation"><Link to="/businesses">Businesses</Link><Link to="/startups">Startups</Link><Link to="/#investors">Investors</Link><Link className="nav-cta" to="/business-health-review">Let’s talk ↗</Link></nav><nav id="site-links" className="nav-links" hidden={!open} aria-label="Main navigation">{links.map(([label,url])=><Link key={url} to={url} onClick={()=>setOpen(false)}>{label}<span aria-hidden="true">↗</span></Link>)}</nav></div></header>;
}


