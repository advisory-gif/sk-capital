import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { offers } from '@/lib/offers';
import { showPrices } from '@/lib/publication.mjs';
import { detectCurrency, isCurrency, savedCurrency, saveCurrency } from '@/lib/currency.mjs';
import type { Currency } from '@/lib/currency.mjs';

function getSavedCurrency() {
  try { return savedCurrency(window.localStorage); } catch { return null; }
}

function ApprovedPrices() {
  const [currency, setCurrency] = useState<Currency | null>(getSavedCurrency);
  const manual = useRef(false);
  useEffect(() => {
    if (getSavedCurrency()) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);
    let active = true;
    detectCurrency(import.meta.env.MODE === 'standalone' ? async () => { throw new Error('Offline review'); } : fetch, controller.signal).then(value => {
      if (active && !manual.current) setCurrency(value);
      window.clearTimeout(timeout);
    });
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);
  const choose = (value: string) => {
    if (!isCurrency(value)) return;
    manual.current = true;
    setCurrency(value);
    try { saveCurrency(window.localStorage, value); } catch { /* Storage may be unavailable. */ }
  };
  const price = (amount: number) => currency === 'INR' ? `₹${amount.toLocaleString('en-IN')}` : currency === 'AED' ? `AED ${amount}` : `US$${amount}`;
  return (
    <div id="published-fees" className="mt-10 border-t border-line pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="font-display text-2xl text-ink">Fixed-scope fees</h3>
        <div>
          <label htmlFor="currency" className="mb-2 block text-sm text-soft">Show prices in</label>
          <select id="currency" value={currency ?? ''} onChange={event => choose(event.target.value)} className="min-h-12 min-w-40 rounded-md border border-line bg-white px-3 text-base text-ink">
            {!currency && <option value="" disabled>Choosing currency…</option>}
            <option value="INR">INR · India</option>
            <option value="USD">USD · International</option>
            <option value="AED">AED · UAE</option>
          </select>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {offers.map(offer => (
          <article key={offer.name} className="service-card border-t border-line pt-5">
            <h4 className="font-display text-2xl text-ink">{offer.question}</h4>
            <p className="mt-2 text-sm font-semibold text-fig">{offer.name}</p>
            <p className="mt-3 text-base leading-relaxed text-soft">{offer.description}</p>
            <p className="mt-4 font-display text-4xl text-ink" aria-live="polite">{currency ? price(offer.prices[currency]) : 'Loading price…'}</p>
            <p className="mt-1 text-sm text-soft">One-time fixed-scope fee</p>
            <Link to={`/samples/${offer.sampleId}`} className="example-link" aria-label={`See an example of ${offer.name}`}>See an example</Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function PriceList() {
  if (!showPrices) return null;
  return <ApprovedPrices />;
}
