import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { bookingUrl } from '@/lib/offers';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-50 bg-white/95 border-b border-forest/15 backdrop-blur-md">
    <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between" aria-label="Main navigation">
      <Link to="/" onClick={close} className="font-ui font-semibold tracking-tight text-2xl text-forest">SK Capital <span className="hidden sm:inline font-ui text-[10px] text-ink uppercase tracking-widest ml-2">Advisory</span></Link>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <Link to="/#services" className="text-ink hover:text-forest">Services</Link>
        <Link to="/#process" className="text-ink hover:text-forest">How it works</Link>
        
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Book a free intro</a>
      </div>
      <button className="md:hidden p-2 text-forest" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </nav>
    {open && <nav id="mobile-menu" aria-label="Mobile navigation" onKeyDown={event => { if (event.key === 'Escape') close(); }} className="md:hidden px-6 pb-6 flex flex-col gap-5 text-forest">
      <Link to="/#services" onClick={close}>Services</Link><Link to="/#process" onClick={close}>How it works</Link>
      <a href={bookingUrl} onClick={close} target="_blank" rel="noopener noreferrer" className="button-primary self-start">Book a free intro</a>
    </nav>}
  </header>;
}
