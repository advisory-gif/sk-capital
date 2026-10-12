import { useEffect, useRef, useState } from 'react';
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
    <section data-reveal id="pricing" className="plain-section">
      <div className="content-width">
        <div className="plain-head">
          <div>
            <span className="plain-rule" aria-hidden="true" />
            <h2 className="plain-title">A Review. Then each month.</h2>
            <p className="plain-line">Choose India, the UAE or the UK.</p>
          </div>
          <div className="max-w-xs">
            <label htmlFor="currency" className="mb-2 block text-sm text-soft">Show prices in</label>
            <select id="currency" value={currency} onChange={event => choose(event.target.value)} className="min-h-12 w-full rounded-md border border-line bg-white px-3 text-base text-ink">
              {markets.map(market => <option key={market.id} value={market.id}>{market.label}</option>)}
            </select>
          </div>
        </div>
          <ol className="price-grid" aria-live="polite">
            <li>
              <h3 className="font-ui text-sm font-medium tracking-wide text-soft">Clearfig Review</h3>
              <p className="price-figure">{review}</p>
              <p className="mt-3 text-sm text-soft">2 to 3 weeks</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-soft">See which customers, products and channels make you money, and which drain it.</p>
              {currency === 'INR' && <p className="mt-4 max-w-md text-base leading-relaxed text-soft">Founding-client pricing is available for the first 3 clients.</p>}
            </li>
            <li>
              <h3 className="font-ui text-sm font-medium tracking-wide text-soft">Clearfig Monthly</h3>
              <p className="price-figure">{monthly}</p>
              <p className="mt-3 text-sm text-soft">per month</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-soft">Each month, see what to grow, what to fix, and what to stop.</p>
            </li>
          </ol>
          <p className="mt-16 max-w-2xl border-t border-line pt-8 text-base leading-relaxed text-soft">Free self-check comes first. The Review is scoped before it starts. The fee is the published price for your market. A Review is paid 50% upfront and 50% on delivery, and credited against the first month of Monthly. Monthly is billed in advance, with a 3-month minimum and then 30 days&apos; notice. Implementation is quoted separately after a Review. Clearfig does not provide bookkeeping, tax or other regulated accounting services.</p>
      </div>
    </section>
  );
}

export default function PriceList() {
  if (!showPrices) return null;
  return <ApprovedPrices />;
}
