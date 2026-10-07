import { Link } from 'react-router-dom';
import { emailAddress } from '@/lib/offers';
export default function Footer() {
  return <footer className="border-t border-white/10 py-10"><div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between gap-6 text-sm text-cool">
    <div><Link to="/" className="font-display text-xl text-gold">SK Capital</Link><p className="mt-2">Clearer numbers. Better business decisions.</p></div>
    <div><a className="text-warm hover:text-gold" href={`mailto:${emailAddress}`}>{emailAddress}</a><p className="mt-2 text-xs">© {new Date().getFullYear()} SK Capital Advisory</p></div>
  </div></footer>;
}
