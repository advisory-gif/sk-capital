import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Shield, Building2, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const audiences = [
  {
    icon: Rocket,
    title: 'Funded startups, raising again',
    description:
      "You're between rounds or in active conversations. You need a fundraising-ready model, a clean data room, and someone who can sit with investors and answer the hard questions.",
  },
  {
    icon: Shield,
    title: 'Funded startups, managing runway',
    description:
      'You raised, you\'re spending, and you need to know exactly how long the runway is, where the burn is going, and what scenarios change the picture.',
  },
  {
    icon: Building2,
    title: 'Growing SMBs, scaling fast',
    description:
      'Revenue is up, hiring is up, and the existing finance setup is starting to crack. You need monthly MIS, real margin breakdowns, and a finance partner who scales with you.',
  },
  {
    icon: Layers,
    title: 'Multi-product or multi-segment businesses',
    description:
      'You sell more than one thing to more than one customer type. You need clarity on which products, segments, or cohorts are actually profitable, not just contributing revenue.',
  },
];

export default function WhoThisIsFor() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.audience-header', {
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

      gsap.from('.audience-card', {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.audience-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-navy"
      style={{ zIndex: 15 }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="audience-header mb-12">
          <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui mb-4 block">
            Who This Is For
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-warm">
            These are the founders we work with.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="audience-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div
                key={index}
                className="audience-card group p-5 lg:p-6 bg-navy-light/50 border border-white/8 rounded-xl hover:border-gold/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display text-lg text-warm mb-3 leading-snug">
                  {audience.title}
                </h3>
                <p className="text-sm text-cool leading-relaxed">
                  {audience.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
