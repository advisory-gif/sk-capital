import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.final-cta-content', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.final-cta-form', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-navy border-t border-white/5"
      style={{ zIndex: 15 }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Content */}
          <div className="final-cta-content lg:w-1/2">
            <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui mb-4 block">
              Get Started
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-warm mb-6 leading-tight">
              Let&apos;s find out what your numbers are really telling you.
            </h2>
            <p className="text-cool leading-relaxed mb-8">
              Tell us about your startup. We&apos;ll show you where reporting,
              forecasting, and cash tracking can get cleaner fast.
            </p>

            <a
              href="https://cal.com/skcapital/free-financial-breakdown"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5 mb-4"
            >
              Book a Free Finance Systems Review
              <ArrowRight size={16} />
            </a>

            <p className="text-xs text-cool/60 mb-6">
              You&apos;ll walk away with 3 clear actions, even if you don&apos;t
              work with us.
            </p>

            <div className="flex items-center gap-2 text-sm text-cool">
              <span>Or reach out directly:</span>
              <a
                href="mailto:advisory@skcapital.co.in"
                className="text-gold hover:underline flex items-center gap-1"
              >
                <Mail size={14} />
                advisory@skcapital.co.in
              </a>
            </div>
          </div>

          {/* Right: Simple Form */}
          <div className="final-cta-form lg:w-1/2">
            <form className="bg-navy-light border border-white/10 rounded-xl p-6 lg:p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-cool mb-2 font-ui uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-warm placeholder:text-cool/50 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cool mb-2 font-ui uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-warm placeholder:text-cool/50 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-cool mb-2 font-ui uppercase tracking-wider">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Your startup name"
                  className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-warm placeholder:text-cool/50 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-cool mb-2 font-ui uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your startup and what you need help with..."
                  className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-warm placeholder:text-cool/50 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
              >
                Send message
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
