import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { offers } from '@/lib/offers';
import { detectCurrency, isCurrency, savedCurrency, saveCurrency } from '@/lib/currency.mjs';
import type { Currency } from '@/lib/currency.mjs';

function getSavedCurrency() {
  try { return savedCurrency(window.localStorage); } catch { return null; }
}
export default function Services() {
  const [currency, setCurrency] = useState<Currency | null>(getSavedCurrency);
  const manual = useRef(false);
  useEffect(() => {
    if (getSavedCurrency()) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);
    let active = true;
    detectCurrency(fetch, controller.signal).then(value => {
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
  return <section id="services" className="section-space bg-sand border-y border-forest/15"><div className="content-width">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"><div><p className="eyebrow">Three starter projects</p><h2 className="section-title">Start with one question.</h2></div>
      <div><label htmlFor="currency" className="block text-xs text-ink mb-2">Show prices in</label><select id="currency" value={currency ?? ''} onChange={event => choose(event.target.value)} className="rounded-xl border border-forest/25 bg-white px-4 py-3 text-sm text-forest min-w-40 focus-visible:outline-forest">{!currency && <option value="" disabled>Choosing currency…</option>}<option value="INR">INR · India</option><option value="USD">USD · International</option><option value="AED">AED · UAE</option></select></div>
    </div>
    <div className="grid lg:grid-cols-3 gap-6">{offers.map((offer, index) => <article key={offer.name} className="border-t border-forest/25 pt-7 pb-3 lg:pr-6 flex flex-col"><span className="font-ui text-xs text-forest mb-5">0{index + 1}</span><h3 className="font-display text-2xl mb-3">{offer.name}</h3><p className="text-ink text-sm leading-relaxed lg:min-h-12">{offer.description}</p><div className="my-6 min-h-16" aria-live="polite"><p className="font-display text-4xl text-forest">{currency ? price(offer.prices[currency]) : <span className="text-lg text-ink">Loading price…</span>}</p><p className="text-xs text-ink mt-2">One-time base fee</p></div><ul className="space-y-4">{offer.features.map(feature => <li key={feature} className="flex gap-3 text-sm text-ink leading-relaxed"><Check size={15} className="text-forest shrink-0 mt-1" /><span>{feature}</span></li>)}</ul></article>)}</div>
    <section id="ai-workflow" className="mt-10 pt-8 border-t border-forest/15 grid md:grid-cols-[1fr_2fr] gap-6">
      <div><p className="eyebrow">Optional workflow support</p><h3 className="font-display text-2xl">AI Finance Workflow Setup</h3><p className="text-forest font-display text-2xl mt-4" aria-live="polite">{currency ? price({ INR: 5000, USD: 59, AED: 219 }[currency]) : 'Loading price…'}</p><p className="text-xs text-ink mt-2">One-time base fee</p></div>
      <div className="text-sm text-ink leading-relaxed space-y-3"><p>Set up one practical ChatGPT or Claude workflow for your finance spreadsheets: one approved spreadsheet input to one draft commentary workflow.</p><p>Includes a reusable prompt and input template, a sample variance-commentary draft, basic test cases, a human-review checklist and a walkthrough.</p><p className="text-xs">Uses your own approved tools and data. Tool subscriptions, API usage, custom integrations and ongoing support are separate. Excel add-in setup depends on compatibility and administrator approval. All AI outputs require human review before financial decisions.</p></div>
    </section>
    <p className="text-xs text-ink leading-relaxed mt-6 max-w-4xl">Fixed fees cover the scope listed above. Prices are set separately for each region. Applicable taxes and payment arrangements will be confirmed before work begins. Currency is suggested from your approximate country when available; you can change it above.</p>
  </div></section>;
}
