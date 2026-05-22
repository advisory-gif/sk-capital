import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CityHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bgRef.current, {
        y: 60,
        scale: 1.08,
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(cardRef.current, {
        y: 50,
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden"
      style={{ zIndex: 14 }}
    >
      <div ref={bgRef} className="absolute inset-0">
        <img
          src="/images/city-skyline.jpg"
          alt="City skyline"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/75" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20 py-24">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-8 h-px bg-gold/50" />
          <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui">
            SK Capital Advisory
          </span>
          <div className="w-8 h-px bg-gold/50" />
        </div>

        <div
          ref={cardRef}
          className="max-w-md bg-navy-light/70 backdrop-blur-md border border-white/10 rounded-xl p-6 lg:p-8"
        >
          <h2 className="font-display text-2xl lg:text-3xl text-warm mb-4">
            Finance Reporting &amp; Forecasting Systems
          </h2>
          <p className="text-cool leading-relaxed mb-6">
            We help growing businesses automate financial reporting,
            forecasting, cash flow tracking, and investor dashboards.
          </p>
          <a
            href="https://cal.com/skcapital/free-financial-breakdown"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors group"
          >
            <span className="relative">
              Book a Free Finance Systems Review
              <span className="absolute bottom-0 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="mt-8">
          <a
            href="https://cal.com/skcapital/free-financial-breakdown"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5"
          >
            Book a Free Finance Systems Review
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
