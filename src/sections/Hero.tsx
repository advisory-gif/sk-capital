import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { openLeadMagnet } from '@/components/Layout';

function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            start = Math.floor(eased * end);
            setCount(start);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.from('.hero-line', {
        y: 50,
        rotateX: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
      })
        .from(
          dashboardRef.current,
          {
            x: 80,
            scale: 0.92,
            opacity: 0,
            duration: 1,
          },
          '-=0.6'
        )
        .from(
          subheadRef.current,
          {
            y: 24,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.5'
        )
        .from(
          ctaRef.current,
          {
            y: 18,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-navy flex items-center overflow-hidden"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 py-24 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <div className="w-full lg:w-1/2 xl:w-5/12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui">
                Finance Reporting &amp; Forecasting Systems
              </span>
            </div>

            <div ref={headlineRef} className="mb-8" style={{ perspective: '800px' }}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-warm leading-[0.95] tracking-tight">
                <span className="hero-line block">Finance Reporting</span>
                <span className="hero-line block">&amp; Forecasting</span>
                <span className="hero-line block mt-1">Systems for</span>
                <span className="hero-line block mt-1">Startups</span>
                <span className="hero-line block mt-1 text-gold">&amp; SMBs</span>
              </h1>
            </div>

            <div ref={subheadRef}>
              <p className="text-lg lg:text-xl text-gold font-display mb-4">
                Premium finance infrastructure, built for growing companies.
              </p>
              <p className="text-base lg:text-lg text-cool leading-relaxed max-w-lg">
                We help growing businesses automate financial reporting,
                forecasting, cash flow tracking, and investor dashboards.
              </p>
            </div>

            <div ref={ctaRef} className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="https://cal.com/skcapital/free-financial-breakdown"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5 text-sm"
              >
                Book a Free Finance Systems Review
                <ArrowRight size={16} />
              </a>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/15 text-warm font-medium rounded-full hover:border-gold/50 hover:text-gold transition-all text-sm"
              >
                See pricing
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={openLeadMagnet}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-cool hover:text-gold transition-colors text-sm"
              >
                <TrendingUp size={14} />
                Free Runway Calculator
              </button>
            </div>

            <p className="mt-6 text-xs text-cool/60 flex items-center gap-2 flex-wrap">
              <span>Free &middot; 30 minutes &middot; No obligations</span>
              <span className="hidden sm:inline">&middot;</span>
              <a
                href="mailto:advisory@skcapital.co.in"
                className="text-gold hover:underline"
              >
                advisory@skcapital.co.in
              </a>
            </p>
          </div>

          <div
            ref={dashboardRef}
            className="w-full lg:w-1/2 xl:w-6/12 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-xl">
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/images/hero-dashboard.jpg"
                  alt="Finance dashboard showing KPIs, burn rate, and runway"
                  className="w-full h-auto"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-navy-light border border-white/10 rounded-lg px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={14} className="text-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-cool font-ui">
                    Monthly Burn
                  </span>
                </div>
                <div className="text-xl font-display text-warm">
                  <AnimatedCounter end={12} suffix=".4L" prefix="₹" />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 lg:-right-8 bg-navy-light border border-white/10 rounded-lg px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-cool font-ui">
                    Runway
                  </span>
                </div>
                <div className="text-xl font-display text-warm">
                  <AnimatedCounter end={18} suffix=" months" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
