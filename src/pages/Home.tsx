import { Link } from 'react-router-dom';
import { useSectionReveal } from '@/hooks/useSectionReveal';
import { ArrowRight } from 'lucide-react';
import Services from '@/components/Reviews';
import CustomProjects from '@/components/CustomProjects';
import { bookingUrl, enquiryUrl, emailAddress } from '@/lib/offers';
import { positioning, heroTitle, heroDescription, businessQuestions, investigationSteps } from '@/lib/advisory';

export default function Home() {
  useSectionReveal();
  return <>
    <section className="py-14 sm:py-20 lg:py-24"><div className="content-width hero-layout"><div className="min-w-0">
      <p className="eyebrow">{positioning}</p><h1 className="font-display text-5xl sm:text-6xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.04] tracking-[-0.025em] text-forest">{heroTitle}</h1>
      <p className="text-ink text-lg leading-relaxed mt-6 max-w-2xl">{heroDescription}</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-8"><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Book a free intro <ArrowRight size={16} /></a><Link to="/#questions" className="text-base text-ink hover:text-forest">Find your starting point ↓</Link></div><p className="text-base leading-relaxed text-ink mt-5">A free introductory conversation. Clearly scoped paid projects.</p>
    </div>
      <figure className="hero-visual">
        <img src="/images/finance-workspace-960.webp" srcSet="/images/finance-workspace-640.webp 640w, /images/finance-workspace-960.webp 960w, /images/finance-workspace-1440.webp 1440w" sizes="(min-width: 1280px) 424px, (min-width: 1024px) 38vw, calc(100vw - 48px)" width={1440} height={960} fetchPriority="high" decoding="async" alt="Illustrative image of hands reviewing financial plans and business charts at a sunlit desk." />
        <figcaption className="text-sm text-ink mt-3">Illustrative image</figcaption>
      </figure>
    </div></section>
    <section data-reveal id="questions" className="section-space border-t border-forest/15"><div className="content-width">
      <p className="eyebrow">Questions worth investigating</p><h2 className="section-title">What is happening in your business?</h2>
      <p className="text-ink leading-relaxed mt-5 max-w-2xl">You do not need to choose a service before we talk. Start with the problem you are noticing or the decision you are weighing up.</p>
      <div className="mt-10">{businessQuestions.map(([question, help], index) => <div key={question} className="grid md:grid-cols-[1fr_1fr] gap-4 md:gap-12 py-7 border-t border-forest/15">
        <h3 className="font-display text-2xl sm:text-3xl text-forest"><span className="block font-ui text-sm mb-3">0{index + 1}</span>{question}</h3><p className="text-ink text-base leading-relaxed md:pt-7">{help}</p>
      </div>)}</div>
      <p className="text-base text-ink leading-relaxed mt-5 max-w-3xl">Marketing support covers performance analysis using the data you provide. Campaign management, SEO and content production sit outside this service.</p>
    </div></section>
    <section data-reveal id="process" className="section-space border-t border-forest/15"><div className="content-width"><p className="eyebrow">How we help</p><h2 className="section-title">From a business question to a useful next step.</h2><div className="grid md:grid-cols-3 gap-10 mt-10">
      {investigationSteps.map(([number, title, text]) => <div key={number}><span className="font-ui text-forest text-base">{number}</span><h3 className="font-display text-2xl mt-4 mb-3">{title}</h3><p className="text-ink text-base leading-relaxed">{text}</p></div>)}
    </div></div></section>
    <Services />
    <CustomProjects />
    <section className="pb-16 lg:pb-24"><div className="content-width"><details className="border-y border-forest/15 py-6"><summary className="cursor-pointer text-forest font-medium">Good to know before you start</summary><div className="max-w-3xl space-y-4 text-base text-ink leading-relaxed mt-5"><p>Each starter project covers one business and one currency, using complete, organised information you provide in the agreed template. It includes a 15-minute discussion of the findings. Larger projects have their own agreed inputs and deliverables.</p><p>Findings depend on the information and assumptions supplied. Our work supports business and financial management; it is not audit, tax, legal or investment advice.</p><p>The intro is free. Analysis and written deliverables are paid work, with scope agreed separately. Delivery timing is agreed after reviewing your needs and inputs, before paid work begins.</p><p>For your first email, a short description of your question is enough. Please do not include bank statements, customer details or other sensitive documents. We will agree what is needed and how to share it.</p></div></details></div></section>
    <section data-reveal id="contact" className="pb-16 lg:pb-24"><div className="content-width"><div className="max-w-3xl"><p className="eyebrow">Start a conversation</p><h2 className="section-title">Not sure what is causing the problem?</h2><p className="text-ink mt-5 leading-relaxed">Tell us what you are noticing. We will use the free intro to understand the question and see whether a focused project would help.</p><div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-8"><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Book a free intro <ArrowRight size={16} /></a><a href={enquiryUrl('Business performance enquiry')} className="text-base text-ink hover:text-forest break-all">{emailAddress}</a></div><p className="text-base leading-relaxed text-ink mt-5">Email opens your email app. Nothing is sent automatically.</p></div></div></section>
  </>;
}
