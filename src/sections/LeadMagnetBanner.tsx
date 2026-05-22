import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ArrowRight } from 'lucide-react';
import { openLeadMagnet } from '@/components/Layout';

gsap.registerPlugin(ScrollTrigger);

export default function LeadMagnetBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lead-banner', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
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
      className="relative py-12 lg:py-16 bg-navy border-t border-white/5"
      style={{ zIndex: 15 }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-4xl mx-auto">
        <div className="lead-banner flex flex-col sm:flex-row items-center justify-between gap-6 p-6 lg:p-8 bg-navy-light border border-white/10 rounded-xl hover:border-gold/30 transition-all cursor-pointer group"
          onClick={openLeadMagnet}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors flex-shrink-0">
              <Download size={22} className="text-gold" />
            </div>
            <div>
              <h3 className="font-display text-lg text-warm mb-1">
                Free Startup Runway Calculator
              </h3>
              <p className="text-sm text-cool">
                Not ready to book a call? Download our free tool to calculate
                your exact cash runway and burn rate.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/10 text-gold font-medium rounded-full group-hover:bg-gold/20 transition-colors text-sm">
              Get it free
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
