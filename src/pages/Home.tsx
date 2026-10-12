import { ArrowRight } from 'lucide-react';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import { useHomeMotion } from '@/hooks/useHomeMotion';
import { PanelCredit, PanelPhoto } from '@/components/PanelPhoto';
import PriceList from '@/components/PriceList';
import { bookingUrl } from '@/lib/offers';
import { founderClose, founders, heroSupport, heroTitle } from '@/lib/advisory';
import { homePhotos, type HomePhoto } from '@/lib/home-photos';

const moves: { word: string; line: string; photo: HomePhoto; tone: 'tone-dark' | 'tone-light' }[] = [
  { word: 'Grow', line: 'What makes you money.', photo: homePhotos.products, tone: 'tone-light' },
  { word: 'Fix', line: 'What is getting in the way.', photo: homePhotos.team, tone: 'tone-dark' },
  { word: 'Stop', line: 'What drains you.', photo: homePhotos.store, tone: 'tone-dark' },
];

export default function Home() {
  useSectionReveal();
  useHomeMotion();
  return <>
    <section className="bleed-panel tone-dark" data-parallax>
      <div className="panel-media">
        <PanelPhoto photo={homePhotos.cafe} eager />
      </div>
      <div className="panel-scrim panel-scrim-dark panel-scrim-deep" />
      <div className="content-width panel-copy">
        <div className="hero-layout">
          <span className="panel-rule" aria-hidden="true" />
          <h1 className="panel-title panel-title-long">{heroTitle}</h1>
          <p className="panel-line">{heroSupport}</p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-8">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
          <p className="panel-note">Any review is scoped before work starts.</p>
        </div>
      </div>
      <PanelCredit photo={homePhotos.cafe} />
    </section>

    <section data-reveal id="problem" className="bleed-panel tone-light" data-parallax>
      <div className="panel-media">
        <PanelPhoto photo={homePhotos.data} />
      </div>
      <div className="panel-sheet">
        <div className="content-width panel-copy">
          <span className="panel-rule" aria-hidden="true" />
          <h2 className="panel-title">You have the data.</h2>
          <p className="panel-line">You still cannot see the business clearly.</p>
          <p className="panel-note">For owner-led agencies and consultancies, and for product and D2C brands.</p>
        </div>
        <PanelCredit photo={homePhotos.data} />
      </div>
    </section>

    <section data-reveal id="review" className="story">
      <h2 className="sr-only">Grow. Fix. Stop.</h2>
      <div className="story-sticky">
        <ol className="story-slides">
          {moves.map(move => (
            <li key={move.word} className={`bleed-panel story-slide ${move.tone}`} data-parallax>
              <div className="panel-media">
                <PanelPhoto photo={move.photo} />
              </div>
              <div className={move.tone === 'tone-light' ? 'panel-scrim panel-scrim-light' : 'panel-scrim panel-scrim-dark'} />
              <div className="content-width panel-copy">
                <span className="panel-rule" aria-hidden="true" />
                <h3 className="panel-title">{move.word}</h3>
                <p className="panel-line">{move.line}</p>
              </div>
              <PanelCredit photo={move.photo} />
            </li>
          ))}
        </ol>
        <div className="story-progress" aria-hidden="true"><span /></div>
      </div>
    </section>

    <PriceList />

    <section data-reveal id="about" className="founders-panel">
      <div className="bleed-panel tone-dark" data-parallax>
        <div className="panel-media">
          <PanelPhoto photo={homePhotos.pour} />
        </div>
        <div className="panel-scrim panel-scrim-dark" />
        <div className="content-width panel-copy">
          <span className="panel-rule" aria-hidden="true" />
          <h2 className="panel-title">The founders.</h2>
          <p className="panel-line">{founderClose}</p>
        </div>
        <PanelCredit photo={homePhotos.pour} />
      </div>
      <div className="founders-sheet">
        <div className="content-width">
          <ul className="founder-grid">
            {founders.map(founder => (
              <li key={founder.name}>
                <h3 className="font-ui text-2xl font-medium tracking-tight text-ink">{founder.name}</h3>
                <p className="mt-2 text-sm text-soft">{founder.role}</p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-soft">{founder.background}</p>
              </li>
            ))}
          </ul>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-12">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  </>;
}
