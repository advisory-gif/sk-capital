import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import MarginExample from '@/components/MarginExample';
import PriceList from '@/components/PriceList';
import { bookingUrl, emailAddress, enquiryUrl } from '@/lib/offers';
import { samples } from '@/lib/samples';
import {
  audience, businessQuestions, deliverables, faqs, founderClose, founders, heroDescription, heroTitle,
  investigationSteps, photos, positioning, trustPoints,
} from '@/lib/advisory';

export default function Home() {
  useSectionReveal();
  return <>
    <section className="section-space !pt-10 sm:!pt-14">
      <div className="content-width hero-layout">
        <div className="min-w-0">
          <p className="eyebrow">{positioning}</p>
          <h1 className="font-display text-4xl leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl lg:text-6xl">{heroTitle}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft">{heroDescription}</p>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-8">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-soft">A free conversation. Any review is scoped before work starts.</p>
        </div>
        <figure className="hero-visual">
          <img
            src={photos.reviewing.src}
            srcSet={photos.reviewing.srcSet}
            sizes="(min-width: 1024px) 42vw, calc(100vw - 2.5rem)"
            width={photos.reviewing.width}
            height={photos.reviewing.height}
            fetchPriority="high"
            decoding="async"
            alt={photos.reviewing.alt}
          />
          <figcaption className="photo-caption">Illustrative photo by <a href={photos.reviewing.href}>Scott Graham</a> on Unsplash. Not a Clearfig client.</figcaption>
        </figure>
      </div>
    </section>

    <section id="who" className="section-space border-t border-line">
      <div className="content-width grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="eyebrow">Who it is for</p>
          <h2 className="section-title">{audience.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">{audience.lead}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-soft">{audience.also}</p>
        </div>
        <aside className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <h3 className="font-display text-2xl text-ink">Not the right fit if you need</h3>
          <p className="mt-4 text-base leading-relaxed text-soft">{audience.notFor}</p>
        </aside>
      </div>
    </section>

    <section data-reveal id="questions" className="section-space border-t border-line">
      <div className="content-width">
        <p className="eyebrow">The picture is already in your data</p>
        <h2 className="section-title">Questions owners ask when the picture is not clear.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">You do not need a new system to start. Bring the reports you already use. We read them with you, across revenue, costs, clients, operations, capacity, marketing and cash.</p>
        <div className="mt-8">
          {businessQuestions.map(([question, help], index) => (
            <div key={question} className="grid gap-3 border-t border-line py-7 md:grid-cols-2 md:gap-12">
              <h3 className="font-display text-2xl text-ink sm:text-3xl"><span className="mb-2 block font-ui text-sm text-fig">0{index + 1}</span>{question}</h3>
              <p className="text-base leading-relaxed text-soft md:pt-7">{help}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section data-reveal id="process" className="section-space border-t border-line bg-wash">
      <div className="content-width">
        <p className="eyebrow">How it works</p>
        <h2 className="section-title">Understand. Decide. Implement. Review.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">Each step starts from your own data. The point is a clearer view of the business, a decision you can carry out, and a look back at what changed.</p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {investigationSteps.map(([number, title, text]) => (
            <li key={number}>
              <span className="font-ui text-sm text-fig">{number}</span>
              <h3 className="mt-3 font-display text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-soft">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section data-reveal id="review" className="section-space border-t border-line">
      <div className="content-width">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">What you get</p>
            <h2 className="section-title">A focused business review, scoped before it starts.</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">One owner. One question, set inside a 360-degree view of the business. The data you already keep. Before any work starts, we agree what we will look at and what you will receive. The review stands on its own.</p>
          </div>
          <figure className="photo-frame">
            <img
              src={photos.charts.src}
              srcSet={photos.charts.srcSet}
              sizes="(min-width: 1024px) 36vw, calc(100vw - 2.5rem)"
              width={photos.charts.width}
              height={photos.charts.height}
              loading="lazy"
              decoding="async"
              alt={photos.charts.alt}
            />
            <figcaption className="photo-caption">Illustrative photo by <a href={photos.charts.href}>Carlos Muza</a> on Unsplash. Not a client report.</figcaption>
          </figure>
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {deliverables.map(([title, text]) => (
            <li key={title} className="border-t border-line pt-5">
              <h3 className="font-display text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-soft">{text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-soft">The Clearfig Review uses your own data for that written report. Agreed before we start: the question, the information you will share, and the timing. The fee is the published price for your market.</p>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-8">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>

    <PriceList />

    <section data-reveal id="accountant" className="section-space border-t border-line">
      <div className="content-width max-w-3xl">
        <p className="eyebrow">Not your accountant</p>
        <h2 className="section-title">The books are one input. The business is the question.</h2>
        <p className="mt-5 text-base leading-relaxed text-soft">An accountant records what happened and handles the filings the law requires. That record can be one input. Clearfig reads it alongside the rest of your data: clients, operations, capacity, marketing and cash.</p>
        <p className="mt-4 text-base leading-relaxed text-soft">Clearfig does not provide bookkeeping, tax, audit or other regulated accounting services. Your accountant remains the right person for the regulated work.</p>
      </div>
    </section>

    <section data-reveal id="examples" className="section-space border-t border-line bg-white">
      <div className="content-width">
        <p className="eyebrow">Examples</p>
        <h2 className="section-title">The same kind of reading, with fictional numbers.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">These examples use made-up US dollar figures. They show how one question in your data, from clients and capacity to marketing and cash, can turn into a next step. They are not client results, and they are not our fees.</p>
        <MarginExample />
        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {samples.map(sample => (
            <li key={sample.id} className="border-t border-line py-5">
              <p className="text-sm font-semibold text-fig">{sample.name}</p>
              <Link to={`/samples/${sample.id}`} className="example-link" aria-label={`See an example of ${sample.name}`}>{sample.question}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section data-reveal id="trust" className="section-space border-t border-line">
      <div className="content-width">
        <p className="eyebrow">How your numbers are handled</p>
        <h2 className="section-title">A clear process. No borrowed trust.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">We will not show logos, quotes or results we do not have. What we can tell you is how the work is agreed, and how your information is treated.</p>
        <ul className="mt-10 grid gap-8 lg:grid-cols-3">
          {trustPoints.map(([title, text]) => (
            <li key={title} className="rounded-lg border border-line bg-white p-6">
              <h3 className="font-display text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-soft">{text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-soft">We do not hold a security certification, and we will not pretend otherwise. Share only what we have agreed.</p>
      </div>
    </section>

    <section data-reveal id="faq" className="section-space border-t border-line">
      <div className="content-width max-w-3xl">
        <p className="eyebrow">Questions</p>
        <h2 className="section-title">Before you book.</h2>
        <div className="mt-8">
          {faqs.map(([question, answer]) => (
            <details key={question} className="border-t border-line py-4">
              <summary className="cursor-pointer py-2 text-base font-semibold text-ink">{question}</summary>
              <p className="pb-2 pt-3 text-base leading-relaxed text-soft">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section data-reveal id="about" className="section-space border-t border-line bg-wash">
      <div className="content-width">
        <p className="eyebrow">About</p>
        <h2 className="section-title">Two founders. One clear view.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">Snesh and Megha are the founders of Clearfig. They help owners see the business clearly through their own data, choose a practical next decision, and carry it out.</p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-soft">Clear means seeing the business as it really is. Fig is the fig tree: natural, fruitful and long-lived. The name is about a clear view today, and a business that can last.</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {founders.map(founder => (
            <li key={founder.name} className="rounded-lg border border-line bg-white p-6">
              <h3 className="font-display text-3xl text-ink">{founder.name}</h3>
              <p className="mt-2 text-base text-fig">{founder.role}</p>
              <p className="mt-4 text-base leading-relaxed text-soft">{founder.background}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-soft">{founderClose}</p>
      </div>
    </section>

    <section data-reveal id="contact" className="section-space border-t border-line">
      <div className="content-width max-w-3xl">
        <p className="eyebrow">Start with your own data</p>
        <h2 className="section-title">Bring one question and the numbers you already have.</h2>
        <p className="mt-5 text-base leading-relaxed text-soft">Tell us what you want to see more clearly. We will use a free conversation to understand the question, and whether a review of your own data would help.</p>
        <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Book a free conversation <ArrowRight size={16} aria-hidden="true" /></a>
          <a href={enquiryUrl('A question about my business')} className="text-base text-ink underline decoration-fig/40 underline-offset-4">{emailAddress}</a>
        </div>
        <p className="mt-5 text-base leading-relaxed text-soft">Email opens your email app. Nothing is sent automatically.</p>
      </div>
    </section>
  </>;
}
