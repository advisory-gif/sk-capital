import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { bookingUrl } from '@/lib/offers';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-50 bg-navy/95 border-b border-white/10 backdrop-blur-md">
    <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between" aria-label="Main navigation">
      <Link to="/" onClick={close} className="font-display text-2xl text-gold">SK Capital <span className="hidden sm:inline font-ui text-[10px] text-cool uppercase tracking-widest ml-2">Advisory</span></Link>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <Link to="/#reviews" className="text-cool hover:text-gold">Reviews</Link>
        <Link to="/#process" className="text-cool hover:text-gold">How it works</Link>
        
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Book a free intro</a>
      </div>
      <button className="md:hidden p-2 text-warm" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </nav>
    {open && <nav id="mobile-menu" aria-label="Mobile navigation" onKeyDown={event => { if (event.key === 'Escape') close(); }} className="md:hidden px-6 pb-6 flex flex-col gap-5 text-warm">
      <Link to="/#reviews" onClick={close}>Reviews</Link><Link to="/#process" onClick={close}>How it works</Link>
      <a href={bookingUrl} onClick={close} target="_blank" rel="noopener noreferrer" className="button-primary self-start">Book a free intro</a>
    </nav>}
  </header>;
}
