import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { bookingUrl } from '@/lib/offers';
import { showPrices } from '@/lib/publication.mjs';
import { formatPrice, prices } from '@/lib/pricing.mjs';
import { detectCurrency, isCurrency, savedCurrency, saveCurrency } from '@/lib/currency.mjs';
import type { Currency } from '@/lib/currency.mjs';

const markets: { id: Currency; label: string }[] = [
  { id: 'INR', label: 'India' },
  { id: 'AED', label: 'UAE' },
  { id: 'GBP', label: 'UK' },
];

function getSavedCurrency() {
  try { return savedCurrency(window.localStorage); } catch { return null; }
}

function ApprovedPrices() {
  const [currency, setCurrency] = useState<Currency>(() => getSavedCurrency() ?? 'INR');
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
  const review = formatPrice(currency, prices[currency].review);
  const monthly = formatPrice(currency, prices[currency].monthly);
  return (
    <section data-reveal id="pricing" className="section-space border-t border-line bg-wash">
      <div className="content-width">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Pricing</p>
            <h2 className="section-title">Free self-check, then a Review, then a month.</h2>
            <p className="mt-5 text-base leading-relaxed text-soft">Three steps. The self-check is free. Choose India, the UAE or the UK for the paid steps. Implementation is quoted separately after a Review.</p>
          </div>
          <div>
            <label htmlFor="currency" className="mb-2 block text-sm text-soft">Show prices in</label>
            <select id="currency" value={currency} onChange={event => choose(event.target.value)} className="min-h-12 min-w-44 rounded-md border border-line bg-white px-3 text-base text-ink">
              {markets.map(market => <option key={market.id} value={market.id}>{market.label}</option>)}
            </select>
          </div>
        </div>
        <ol className="mt-10 grid gap-6 lg:grid-cols-3" aria-live="polite">
          <li className="flex flex-col rounded-lg border border-line bg-white p-6">
            <span className="font-ui text-sm text-fig">01</span>
            <h3 className="mt-3 font-display text-2xl text-ink">Free self-check</h3>
            <p className="mt-4 font-display text-4xl text-ink">Free</p>
            <p className="mt-4 text-base leading-relaxed text-soft">A free first step with the numbers you already have, before any paid work.</p>
          </li>
          <li className="flex flex-col rounded-lg border border-fig bg-white p-6">
            <span className="font-ui text-sm text-fig">02</span>
            <h3 className="mt-3 font-display text-2xl text-ink">Clearfig Review</h3>
            <p className="mt-4 font-display text-4xl text-ink">{review}</p>
            <p className="mt-1 text-sm text-soft">2 to 3 weeks</p>
            <p className="mt-4 text-base leading-relaxed text-soft">We use your own data to show margin by client, project and service, where money leaks, and the 3 decisions to make next, in a written report.</p>
            <p className="mt-4 text-base leading-relaxed text-soft">Paid 50% upfront and 50% on delivery, and credited against the first month of Monthly.</p>
            {currency === 'INR' && <p className="mt-4 text-base leading-relaxed text-soft">Founding-client pricing is available for the first 3 clients.</p>}
          </li>
          <li className="flex flex-col rounded-lg border border-line bg-white p-6">
            <span className="font-ui text-sm text-fig">03</span>
            <h3 className="mt-3 font-display text-2xl text-ink">Clearfig Monthly</h3>
            <p className="mt-4 font-display text-4xl text-ink">{monthly}</p>
            <p className="mt-1 text-sm text-soft">per month</p>
            <p className="mt-4 text-base leading-relaxed text-soft">A monthly dashboard and a review call. Billed in advance, with a 3-month minimum and then 30 days&apos; notice.</p>
          </li>
        </ol>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-soft">Implementation is quoted separately after a Review. Clearfig does not provide bookkeeping, tax or other regulated accounting services.</p>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-8">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

export default function PriceList() {
  if (!showPrices) return null;
  return <ApprovedPrices />;
}
