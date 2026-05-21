import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { openLeadMagnet } from '@/components/Layout';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Starter',
    planNum: 'Plan 01',
    description: 'For early-stage startups needing financial clarity.',
    priceINR: '₹50,000 to ₹75,000',
    priceUSD: '$600 to $900',
    features: [
      'Monthly forecasting and variance analysis',
      'Core management reporting pack',
      'Runway, burn, and cash visibility',
      'Email support for finance questions',
    ],
  },
  {
    name: 'Growth',
    planNum: 'Plan 02',
    description: 'For scaling startups raising or preparing to raise.',
    priceINR: '₹75,000 to ₹1.25L',
    priceUSD: '$900 to $1,500',
    featured: true,
    features: [
      'Everything in Starter',
      'Investor-ready dashboards and board updates',
      'Scenario planning for hiring and fundraising',
      'Deeper forecasting and reporting support',
    ],
  },
  {
    name: 'Scale',
    planNum: 'Plan 03',
    description: 'For funded startups needing deeper finance systems support.',
    priceINR: '₹2L+',
    priceUSD: '$2,400+',
    features: [
      'Full support across reporting, planning, and investor materials',
      'Leadership-level dashboards and monthly reviews',
      'Support for board decks and investor updates',
      'Hands-on advisory as finance complexity grows',
    ],
  },
];

const comparisonFeatures = [
  { name: 'Monthly MIS pack', starter: true, growth: true, scale: true },
  { name: 'Cash flow visibility', starter: true, growth: true, scale: true },
  { name: 'Runway analysis', starter: true, growth: true, scale: true },
  { name: 'Variance commentary', starter: true, growth: true, scale: true },
  { name: 'Investor dashboards', starter: false, growth: true, scale: true },
  { name: 'Board deck support', starter: false, growth: true, scale: true },
  { name: 'Scenario planning', starter: false, growth: true, scale: true },
  { name: 'Fundraising data room', starter: false, growth: false, scale: true },
  { name: 'Weekly check-ins', starter: false, growth: false, scale: true },
  { name: 'Dedicated finance lead', starter: false, growth: false, scale: true },
];

const faqs = [
  {
    q: "What's included in the free 30-min call?",
    a: "We review your current financial setup, identify the biggest gaps, and recommend 3 immediate actions you can take. Even if you don't work with us, you'll walk away with clarity.",
  },
  {
    q: 'Can I pause my plan?',
    a: "Yes. We understand startups have seasonal needs. You can pause for up to 2 months per year with 2 weeks' notice.",
  },
  {
    q: 'How quickly can you start?',
    a: "We can typically begin within 5-7 business days of the intro call. For urgent needs, we offer a paid expedited onboarding (3 days).",
  },
  {
    q: 'What if I need more scope mid-month?',
    a: "We'll assess the additional work and provide a prorated quote. No surprise bills—everything is agreed upon in writing.",
  },
  {
    q: 'Do you sign NDAs?',
    a: "Absolutely. We have a standard mutual NDA we're happy to sign before any data sharing. Your financial data is never used to train AI models.",
  },
  {
    q: 'Indian or international clients—any difference?',
    a: "We work with both. Pricing is in INR by default, but we can invoice in USD for international clients. All major time zones are covered.",
  },
];

export default function Pricing() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: pageRef.current, start: 'top 80%' },
      });
      gsap.from('.pricing-card', {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.pricing-cards', start: 'top 80%' },
      });
      gsap.from('.comparison-section', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.comparison-section', start: 'top 80%' },
      });
      gsap.from('.faq-section', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.faq-section', start: 'top 80%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pt-24 lg:pt-32 pb-16">
      {/* Header */}
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-6xl mx-auto mb-12">
        <div className="pricing-header text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-gold/50" />
            <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui">
              Pricing
            </span>
            <div className="w-8 h-px bg-gold/50" />
          </div>
          <h1 className="font-display text-3xl lg:text-5xl text-warm mb-4">
            Simple monthly pricing. No surprises.
          </h1>
          <p className="text-lg text-gold font-display mb-2">
            Start small. Upgrade as you grow.
          </p>
          <p className="text-cool max-w-2xl mx-auto">
            Choose the support level that fits your current stage, then scale
            when reporting, planning, and investor expectations become more
            demanding.
          </p>
        </div>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-navy-light border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                currency === 'INR'
                  ? 'bg-gold text-navy'
                  : 'text-cool hover:text-warm'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-gold text-navy'
                  : 'text-cool hover:text-warm'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card relative p-6 lg:p-8 rounded-xl border transition-all hover:-translate-y-1 ${
                plan.featured
                  ? 'bg-navy-light border-gold/40'
                  : 'bg-navy-light/50 border-white/8 hover:border-gold/30'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gold text-navy text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.18em] text-cool font-ui">
                  {plan.planNum}
                </span>
                <h3 className="font-display text-2xl text-warm mt-2 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-cool mb-4">{plan.description}</p>
                <div className="text-2xl lg:text-3xl font-display text-warm">
                  {currency === 'INR' ? plan.priceINR : plan.priceUSD}
                </div>
                <span className="text-sm text-cool">per month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-cool">
                    <Check size={16} className="text-gold flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://cal.com/skcapital/free-financial-breakdown"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all text-sm ${
                  plan.featured
                    ? 'bg-gold text-navy hover:bg-gold/90'
                    : 'border border-white/15 text-warm hover:border-gold/50 hover:text-gold'
                }`}
              >
                Book a Free Finance Systems Review
              </a>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-cool/60 mb-16">
          All plans start with a{' '}
          <span className="text-gold">free 30-minute intro call</span>. Currency
          switcher updates all plan prices instantly. INR is the base price, USD
          is indicative. Questions? Write to us at{' '}
          <a href="mailto:advisory@skcapital.co.in" className="text-gold hover:underline">
            advisory@skcapital.co.in
          </a>
        </p>

        {/* Comparison Table */}
        <div className="comparison-section mb-16">
          <h2 className="font-display text-2xl text-warm mb-6 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-cool font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-cool font-medium">Starter</th>
                  <th className="text-center py-4 px-4 text-gold font-medium">Growth</th>
                  <th className="text-center py-4 px-4 text-cool font-medium">Scale</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 px-4 text-warm">{feature.name}</td>
                    <td className="text-center py-3 px-4">
                      {feature.starter ? (
                        <Check size={16} className="text-gold mx-auto" />
                      ) : (
                        <span className="text-cool/30">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {feature.growth ? (
                        <Check size={16} className="text-gold mx-auto" />
                      ) : (
                        <span className="text-cool/30">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {feature.scale ? (
                        <Check size={16} className="text-gold mx-auto" />
                      ) : (
                        <span className="text-cool/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <HelpCircle size={20} className="text-gold" />
            <h2 className="font-display text-2xl text-warm">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white/8 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-warm text-sm lg:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-cool flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-cool leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-warm mb-4">
            Not sure which plan fits?
          </p>
          <a
            href="https://cal.com/skcapital/free-financial-breakdown"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5"
          >
            Book a Free Finance Systems Review
            <ArrowRight size={16} />
          </a>
          <p className="text-xs text-cool/60 mt-4">
            You&apos;ll walk away with 3 clear actions, even if you don&apos;t
            work with us.
          </p>
          <button
            onClick={openLeadMagnet}
            className="mt-4 text-sm text-gold hover:underline"
          >
            Or get our free Runway Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
