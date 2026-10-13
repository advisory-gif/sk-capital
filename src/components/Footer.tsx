import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { tagline } from '@/lib/advisory';
import { emailAddress } from '@/lib/offers';

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="content-width grid gap-8 sm:grid-cols-2">
        <div>
          <Link to="/" className="inline-block text-ink"><Logo /></Link>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-soft">{tagline}</p>
        </div>
        <div className="sm:text-right">
          <a className="text-leaf underline decoration-leaf/40 underline-offset-4 hover:decoration-leaf" href={`mailto:${emailAddress}`}>{emailAddress}</a>
          <p className="mt-3 text-sm text-soft"><Link to="/#pricing" className="hover:text-ink">The check</Link> · <Link to="/details" className="hover:text-ink">Details</Link> · <Link to="/samples" className="hover:text-ink">Examples</Link></p>
          <p className="mt-3 text-sm text-soft">© {new Date().getFullYear()} Clearfig</p>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-soft sm:col-span-2">Clearfig works beside your accountant. It is not a bookkeeping, tax, audit or a CFO service. Examples on this site are fictional.</p>
      </div>
    </footer>
  );
}
