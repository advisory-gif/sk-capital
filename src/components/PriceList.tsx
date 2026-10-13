import { bookingLabel, bookingUrl } from '@/lib/offers';

const steps = [
  ['Business check', '30 minutes, free.', 'A first look at how the business makes money, before any paid work.'],
  ['Health check', 'Scoped before it starts.', 'Customers, products, pricing, channels, marketing and money, read together.'],
] as const;

export default function PriceList() {
  return (
    <section data-reveal id="pricing" className="plain-section">
      <div className="content-width">
        <span className="plain-rule" aria-hidden="true" />
        <h2 className="plain-title">The health check.</h2>
        <p className="plain-line">A 360-degree look at the business. Clearfig works beside your accountant. It is not a bookkeeping, tax, audit or a CFO service.</p>
        <ol className="price-grid">
          {steps.map(([name, time, text]) => (
            <li key={name}>
              <h3 className="font-ui text-sm font-medium tracking-wide text-soft">{name}</h3>
              <p className="mt-3 text-sm text-soft">{time}</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-soft">{text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-16 max-w-2xl border-t border-line pt-8 text-base leading-relaxed text-soft">The 30-minute business check is free. Any further work is scoped before it starts, and the fee is agreed then. Clearfig does not provide bookkeeping, tax, audit, CFO or other regulated accounting services.</p>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-8">{bookingLabel}</a>
      </div>
    </section>
  );
}
