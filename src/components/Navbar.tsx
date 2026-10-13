import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { bookingLabel, bookingUrl } from '@/lib/offers';

const links = [
  ['/#review', 'The fix'],
  ['/#pricing', 'The check'],
  ['/details', 'Details'],
  ['/samples', 'Examples'],
  ['/#about', 'About'],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-paper"
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          close();
          toggleRef.current?.focus();
        }
      }}
    >
      <nav className="content-width flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]" aria-label="Main navigation">
        <Link to="/" onClick={close} className="shrink-0 text-ink"><Logo /></Link>
        <div className="hidden items-center gap-4 text-sm font-medium xl:gap-6 lg:flex">
          {links.map(([href, label]) => <Link key={href} to={href} className="text-ink/80 hover:text-ink">{label}</Link>)}
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary nav-cta">{bookingLabel}</a>
        </div>
        <button
          ref={toggleRef}
          className="inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(value => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="content-width flex flex-col gap-1 pb-5 lg:hidden">
          {links.map(([href, label]) => <Link key={href} to={href} onClick={close} className="py-3 text-ink">{label}</Link>)}
          <a href={bookingUrl} onClick={close} target="_blank" rel="noopener noreferrer" className="button-primary mt-2 self-start">{bookingLabel}</a>
        </nav>
      )}
    </header>
  );
}
