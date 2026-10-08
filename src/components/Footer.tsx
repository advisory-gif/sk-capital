import { Link } from 'react-router-dom';
import { emailAddress } from '@/lib/offers';
export default function Footer() {
  return <footer className="border-t border-forest/15 py-10"><div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between gap-6 text-base text-ink">
    <div><Link to="/" className="font-ui font-semibold tracking-tight text-2xl text-forest">SK Capital</Link><p className="mt-2">Business Performance Advisory</p></div>
    <div><a className="text-forest hover:text-forest" href={`mailto:${emailAddress}`}>{emailAddress}</a><p className="mt-2 text-sm">© {new Date().getFullYear()} SK Capital Advisory</p></div>
  </div></footer>;
}
