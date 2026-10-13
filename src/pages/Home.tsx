import { ArrowRight } from 'lucide-react';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import PriceList from '@/components/PriceList';
import { bookingLabel, bookingUrl } from '@/lib/offers';
import { founderClose, founders, heroSupport, heroTitle } from '@/lib/advisory';

const sources = ['Customers', 'Products', 'Pricing', 'Channels', 'Marketing', 'Money'];
const moves = [
  ['Grow', 'What makes you money.'],
  ['Fix', 'What is getting in the way.'],
  ['Stop', 'What drains you.'],
] as const;

export default function Home() {
  useSectionReveal();
  return <>
    <section data-reveal id="problem" className="plain-section">
      <div className="content-width">
        <span className="plain-rule" aria-hidden="true" />
        <h2 className="plain-title">You have the data.</h2>
        <p className="plain-line">You still cannot see the business clearly.</p>
        <p className="plain-note">For growing owner-led businesses, in any sector, anywhere.</p>
        <ul className="source-grid">
          {sources.map(source => (
            <li key={source}>
              <span>{source}</span>
              <span className="source-mark" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="plain-section">
      <div className="content-width plain-split">
        <div className="hero-layout">
          <span className="plain-rule" aria-hidden="true" />
          <h1 className="plain-title plain-title-tagline">{heroTitle}</h1>
          <p className="plain-line">{heroSupport}</p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-8">{bookingLabel} <ArrowRight size={16} aria-hidden="true" /></a>
          <p className="plain-note">The 30-minute business check is free. Any further work is scoped before it starts.</p>
        </div>
        <figure className="clear-chart">
          <figcaption>One view. Not a client result.</figcaption>
          <div className="clear-row">
            <span>Makes you money</span>
            <span className="clear-track"><span className="clear-bar clear-bar-money" /></span>
          </div>
          <div className="clear-row">
            <span>Drains you</span>
            <span className="clear-track"><span className="clear-bar clear-bar-drain" /></span>
          </div>
        </figure>
      </div>
    </section>

    <section data-reveal id="review" className="plain-section">
      <div className="content-width">
        <h2 className="sr-only">Grow. Fix. Stop.</h2>
        <span className="plain-rule" aria-hidden="true" />
        <ol className="move-list">
          {moves.map(([word, line]) => (
            <li key={word}>
              <h3>{word}</h3>
              <p>{line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <PriceList />

    <section data-reveal id="about" className="plain-section">
      <div className="content-width">
        <span className="plain-rule" aria-hidden="true" />
        <h2 className="plain-title">The founders.</h2>
        <p className="plain-line">{founderClose}</p>
        <ul className="founder-grid">
          {founders.map(founder => (
            <li key={founder.name}>
              <h3 className="font-display text-2xl tracking-tight text-ink">{founder.name}</h3>
              <p className="mt-2 text-sm text-soft">{founder.role}</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-soft">{founder.background}</p>
            </li>
          ))}
        </ul>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-12">{bookingLabel} <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  </>;
}
