import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import MarginExample from '@/components/MarginExample';
import { bookingUrl, offers } from '@/lib/offers';
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
  return <section data-reveal id="services" className="section-space bg-sand border-y border-forest/15"><div className="content-width">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"><div><p className="eyebrow">Three starter projects</p><h2 className="section-title">A focused way to get started.</h2><p className="text-ink text-base leading-relaxed mt-5 max-w-2xl">Start with a focused financial check, or speak to us about a broader business question.</p></div>
      <div><label htmlFor="currency" className="block text-sm text-ink mb-2">Show prices in</label><select id="currency" value={currency ?? ''} onChange={event => choose(event.target.value)} className="rounded-xl border border-forest/25 bg-white px-4 py-3 text-base text-forest min-w-40 focus-visible:outline-forest">{!currency && <option value="" disabled>Choosing currency…</option>}<option value="INR">INR · India</option><option value="USD">USD · International</option><option value="AED">AED · UAE</option></select></div>
    </div>
    <div className="grid lg:grid-cols-3 gap-6">{offers.map((offer, index) => <article key={offer.name} className="service-card border-t border-forest/25 pt-7 pb-3 lg:pr-6 flex flex-col"><span className="font-ui text-sm text-forest mb-5">0{index + 1}</span><h3 className="font-display text-2xl mb-3">{offer.question}</h3><p className="text-sm font-semibold text-forest mb-3">{offer.name}</p><p className="text-ink text-base leading-relaxed lg:min-h-12">{offer.description}</p><div className="my-6 min-h-16" aria-live="polite"><p className="font-display text-4xl text-forest">{currency ? price(offer.prices[currency]) : <span className="text-lg text-ink">Loading price…</span>}</p><p className="text-sm text-ink mt-2">One-time fixed-scope fee</p></div><ul className="space-y-4">{offer.features.map(feature => <li key={feature} className="flex gap-3 text-base text-ink leading-relaxed"><Check size={15} className="text-forest shrink-0 mt-1" /><span>{feature}</span></li>)}</ul><Link to={`/samples/${offer.sampleId}`} className="example-link pt-6 mt-auto" aria-label={`See an example of ${offer.name}`}>See an example <span aria-hidden="true">↗</span></Link></article>)}</div>
    <div id="starter-conditions" className="mt-8 border-y border-forest/15 py-6 max-w-4xl"><h3 className="font-ui font-semibold text-base">Included with every starter</h3><p className="text-base text-ink leading-relaxed mt-3">One business, one currency, and complete, organised inputs in the agreed template. Each project includes a 15-minute discussion of the findings.</p><p className="text-base text-ink leading-relaxed mt-3">We review your needs and inputs, then agree delivery timing before paid work begins. The fee covers the listed scope. Applicable taxes and payment arrangements are confirmed before work begins.</p></div>
    <div className="mt-8"><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Discuss a starter project <ArrowRight size={16} /></a></div>
    <MarginExample />
    <section id="ai-workflow" className="mt-10 pt-8 border-t border-forest/15 grid md:grid-cols-[1fr_2fr] gap-6">
      <div><p className="eyebrow">Optional workflow support</p><h3 className="font-display text-2xl">Spend less time drafting routine commentary.</h3><p className="text-sm font-semibold text-forest mt-3">AI Finance Workflow Setup</p><p className="text-forest font-display text-2xl mt-4" aria-live="polite">{currency ? price({ INR: 5000, USD: 59, AED: 219 }[currency]) : 'Loading price…'}</p><p className="text-sm text-ink mt-2">One-time fixed-scope fee</p></div>
      <div className="text-base text-ink leading-relaxed space-y-3"><p>Set up one practical ChatGPT or Claude workflow for your finance spreadsheets: one approved spreadsheet input to one draft commentary workflow.</p><p>Includes a reusable prompt and input template, a sample variance-commentary draft, basic test cases, a human-review checklist and a walkthrough.</p><p className="text-sm">Uses your own approved tools and data. Software subscriptions and API usage are excluded from this fee. Custom integrations and ongoing support need a separate agreed scope. Excel add-in setup depends on compatibility and administrator approval. All AI outputs require human review before financial decisions.</p><Link to="/samples/ai-finance-workflow" className="example-link" aria-label="See an example of AI Finance Workflow Setup">See an example <span aria-hidden="true">↗</span></Link></div>
    </section>
    <p className="text-sm text-ink leading-relaxed mt-6 max-w-4xl">Fixed fees cover the scope listed above. Prices are set separately for each region. Applicable taxes and payment arrangements will be confirmed before work begins. Currency is suggested from your approximate country when available; you can change it above.</p>
  </div></section>;
}
