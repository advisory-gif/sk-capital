import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const findings = [
  {
    icon: AlertTriangle,
    text: 'Hidden cost leaks that were never tracked',
  },
  {
    icon: Eye,
    text: 'A clear picture of cash runway under realistic scenarios',
  },
  {
    icon: TrendingUp,
    text: "What's actually driving profit, not just revenue",
  },
  {
    icon: TrendingDown,
    text: 'Which spend creates value, and which is drag',
  },
];

export default function WhatFoundersFind() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.findings-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.finding-card', {
        x: -24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          end: 'top 45%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.findings-quote', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.findings-quote',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28"
      style={{ background: '#111827', zIndex: 15 }}
    >
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="findings-header text-center mb-12">
          <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui mb-4 block">
            Within 7 days
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-warm">
            What founders usually find.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-12">
          {findings.map((finding, index) => {
            const Icon = finding.icon;
            return (
              <div
                key={index}
                className="finding-card group flex items-start gap-4 p-5 lg:p-6 bg-navy/50 border border-white/8 rounded-xl hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Icon size={20} className="text-gold" />
                </div>
                <p className="text-warm/90 text-sm lg:text-base leading-relaxed pt-2">
                  {finding.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quote */}
        <div className="findings-quote text-center border-l-2 border-gold pl-6 mx-auto max-w-2xl">
          <p className="text-lg lg:text-xl text-warm/80 font-display italic leading-relaxed">
            Most founders don&apos;t have a data problem. They have a clarity
            problem.
          </p>
        </div>
      </div>
    </section>
  );
}
