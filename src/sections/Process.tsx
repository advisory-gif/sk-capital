import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, FileText, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: Clock,
    title: 'Free finance systems review',
    time: '30 min',
    description:
      "We look at your current reporting, forecasting, cash tracking, and dashboards together. We tell you what we see. No sales pitch.",
  },
  {
    number: '02',
    icon: FileText,
    title: 'A focused 1-page report',
    time: '48 hours',
    description:
      "Within 48 hours: your burn rate, runway, reporting gaps, and 3 specific actions you can take immediately. Free, regardless of whether we work together. Most founders we send this to have never seen their finance systems laid out this cleanly.",
    hasPreview: true,
  },
  {
    number: '03',
    icon: Zap,
    title: 'Start with the right support level',
    time: 'Ongoing',
    description:
      "We recommend the scope that fits your current stage, then help you build reporting, forecasting, cash tracking, and investor-ready dashboards from there.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.process-step', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 80%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-20 lg:py-28 bg-navy"
      style={{ zIndex: 15 }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        <div className="process-header mb-12 lg:mb-16">
          <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui mb-4 block">
            Process
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-warm">
            Three steps to clarity.
          </h2>
        </div>

        <div className="process-steps relative">
          <div
            ref={lineRef}
            className="hidden lg:block absolute left-[27px] top-12 bottom-12 w-px bg-gold/20"
          />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="process-step flex flex-col lg:flex-row gap-6 lg:gap-10"
                >
                  <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:w-16 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Icon size={22} className="text-gold" />
                    </div>
                    <div className="lg:hidden flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-gold font-ui bg-gold/10 px-3 py-1 rounded-full">
                        {step.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl font-display text-gold/40">
                        {step.number}
                      </span>
                      <h3 className="font-display text-xl lg:text-2xl text-warm">
                        {step.title}
                      </h3>
                      <span className="hidden lg:inline-flex text-xs uppercase tracking-wider text-gold font-ui bg-gold/10 px-3 py-1 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-cool leading-relaxed max-w-2xl mb-4">
                      {step.description}
                    </p>

                    {step.hasPreview && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-white/10 max-w-xs">
                        <img
                          src="/images/process-report.jpg"
                          alt="Sample 1-page financial report"
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
