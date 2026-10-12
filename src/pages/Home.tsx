import { ArrowRight } from 'lucide-react';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import PriceList from '@/components/PriceList';
import { bookingUrl } from '@/lib/offers';
import { founderClose, founders, heroSupport, heroTitle } from '@/lib/advisory';

const moves: [string, string][] = [
  ['Grow', 'What makes you money.'],
  ['Fix', 'What is getting in the way.'],
  ['Stop', 'What drains you.'],
];

export default function Home() {
  useSectionReveal();
  return <>
    <section className="section-loose">
      <div className="content-width">
        <div className="hero-layout">
          <h1 className="font-display text-4xl leading-[1.12] tracking-[-0.03em] text-ink sm:text-5xl">{heroTitle}</h1>
          <p className="mt-8 text-lg leading-relaxed text-soft">{heroSupport}</p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-10">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
          <p className="mt-4 text-base leading-relaxed text-soft">Any review is scoped before work starts.</p>
        </div>
      </div>
    </section>

    <section data-reveal id="problem" className="section-loose border-t border-line">
      <div className="content-width max-w-3xl">
        <h2 className="section-title">You have the data.</h2>
        <p className="mt-6 text-lg leading-relaxed text-soft">You still cannot see the business clearly.</p>
        <p className="mt-8 text-base leading-relaxed text-soft">For owner-led agencies and consultancies, and for product and D2C brands.</p>
      </div>
    </section>

    <section data-reveal id="review" className="section-loose border-t border-line bg-wash">
      <div className="content-width">
        <h2 className="section-title">Grow. Fix. Stop.</h2>
        <ol className="mt-16 grid gap-14 sm:grid-cols-3">
          {moves.map(([word, line]) => (
            <li key={word}>
              <h3 className="font-display text-4xl text-ink sm:text-5xl">{word}</h3>
              <p className="mt-4 text-base leading-relaxed text-soft">{line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <PriceList />

    <section data-reveal id="about" className="section-loose border-t border-line">
      <div className="content-width">
        <h2 className="section-title">The founders.</h2>
        <ul className="mt-16 grid gap-12 sm:grid-cols-2">
          {founders.map(founder => (
            <li key={founder.name}>
              <h3 className="font-display text-3xl text-ink">{founder.name}</h3>
              <p className="mt-2 text-base text-fig">{founder.role}</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-soft">{founder.background}</p>
            </li>
          ))}
        </ul>
        <p className="mt-14 max-w-xl text-lg leading-relaxed text-ink">{founderClose}</p>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-10">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  </>;
}
