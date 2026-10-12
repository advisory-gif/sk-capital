import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import { emailAddress, enquiryUrl } from '@/lib/offers';
import {
  audience, businessQuestions, deliverables, faqs, investigationSteps, photos, trustPoints,
} from '@/lib/advisory';

export default function Details() {
  useSectionReveal();
  return <>
    <section className="section-space">
      <div className="content-width max-w-3xl">
        <p className="eyebrow">Details</p>
        <h1 className="section-title">The rest of the picture.</h1>
        <p className="mt-6 text-lg leading-relaxed text-soft">The homepage is the offer. This page is who it is for, what a Review covers, and how your data is handled.</p>
        <p className="mt-4 text-base leading-relaxed text-soft">Clear means seeing the business as it really is. Fig is the fig tree: natural, fruitful and long-lived.</p>
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

    <section data-reveal id="deliverables" className="section-space border-t border-line">
      <div className="content-width">
        <p className="eyebrow">What you get</p>
        <h2 className="section-title">A focused business review, scoped before it starts.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft">One question, read across customers, products, channels, marketing and costs. Before any work starts, we agree what we will look at and what you will receive. The review stands on its own.</p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {deliverables.map(([title, text]) => (
            <li key={title} className="border-t border-line pt-5">
              <h3 className="font-display text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-soft">{text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-soft">The Clearfig Review uses your own data for that written report. Agreed before we start: the question, the information you will share, and the timing. The fee is the published price for your market.</p>
      </div>
    </section>

    <section data-reveal id="accountant" className="section-space border-t border-line">
      <div className="content-width max-w-3xl">
        <p className="eyebrow">Not your accountant</p>
        <h2 className="section-title">The books are one input. The business is the question.</h2>
        <p className="mt-5 text-base leading-relaxed text-soft">An accountant records what happened and handles the filings the law requires. That record can be one input. Clearfig reads it alongside the rest of your data: clients, operations, capacity, marketing and cash.</p>
        <p className="mt-4 text-base leading-relaxed text-soft">Clearfig does not provide bookkeeping, tax, audit or other regulated accounting services. Your accountant remains the right person for the regulated work.</p>
      </div>
    </section>

    <section data-reveal id="examples" className="section-space border-t border-line bg-white">
      <div className="content-width max-w-3xl">
        <p className="eyebrow">Examples</p>
        <h2 className="section-title">Fictional numbers. Real kinds of questions.</h2>
        <p className="mt-5 text-base leading-relaxed text-soft">Eight examples use made-up US dollar figures. They are not client results, and they are not our fees.</p>
        <Link to="/samples" className="example-link mt-6">See the examples <ArrowRight size={16} aria-hidden="true" /></Link>
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

    <section id="contact" className="section-space border-t border-line">
      <div className="content-width max-w-3xl">
        <h2 className="section-title">Bring one question and the numbers you already have.</h2>
        <p className="mt-5 text-base leading-relaxed text-soft">A short note is enough. Do not include bank statements or customer lists in the first email.</p>
        <a href={enquiryUrl('A question about my business')} className="mt-6 inline-block text-base text-ink underline decoration-fig/40 underline-offset-4">{emailAddress}</a>
        <p className="mt-4 text-base leading-relaxed text-soft">Email opens your email app. Nothing is sent automatically.</p>
        <div className="mt-12 grid gap-10">
          <figure className="hero-visual max-w-xl">
            <img src={photos.reviewing.src} srcSet={photos.reviewing.srcSet} sizes="(min-width: 768px) 36rem, calc(100vw - 2.5rem)" width={photos.reviewing.width} height={photos.reviewing.height} fetchPriority="high" decoding="async" alt={photos.reviewing.alt} />
            <figcaption className="photo-caption">Illustrative photo by <a href={photos.reviewing.href}>Scott Graham</a> on Unsplash. Not a Clearfig client.</figcaption>
          </figure>
          <figure className="photo-frame max-w-xl">
            <img src={photos.charts.src} srcSet={photos.charts.srcSet} sizes="(min-width: 768px) 36rem, calc(100vw - 2.5rem)" width={photos.charts.width} height={photos.charts.height} loading="lazy" decoding="async" alt={photos.charts.alt} />
            <figcaption className="photo-caption">Illustrative photo by <a href={photos.charts.href}>Carlos Muza</a> on Unsplash. Not a client report.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  </>;
}
