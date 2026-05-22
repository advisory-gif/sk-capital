import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { openLeadMagnet } from '@/components/Layout';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  'All',
  'Reporting Systems',
  'Fundraising',
  'Startup Finance',
  'Metrics',
  'AI in Finance',
];

const blogPosts = [
  {
    title: 'How to Calculate Your Startup Runway (The Right Way)',
    excerpt:
      'Most founders get this wrong. Here\'s the exact formula we use with our clients, including the adjustments for deferred revenue, credit lines, and one-time expenses.',
    category: 'Startup Finance',
    readTime: '6 min read',
    date: 'May 2026',
    slug: 'how-to-calculate-runway',
  },
  {
    title: 'The 3 Financial Metrics Every Investor Asks About',
    excerpt:
      'Burn rate, runway, and unit economics. But it\'s not just about the numbers—it\'s about the story they tell. Here\'s how to frame them.',
    category: 'Fundraising',
    readTime: '8 min read',
    date: 'Apr 2026',
    slug: '3-metrics-investors-ask',
  },
  {
    title: 'Building Your First Financial Model: A Step-by-Step Guide',
    excerpt:
      'From revenue assumptions to cash flow projections. A practical guide for founders who need a model that actually works.',
    category: 'Reporting Systems',
    readTime: '12 min read',
    date: 'Apr 2026',
    slug: 'first-financial-model-guide',
  },
  {
    title: 'Why Your Gross Margin is Wrong (And How to Fix It)',
    excerpt:
      'COGS allocation mistakes can distort your unit economics by 20-30%. Here are the most common errors we see and how to correct them.',
    category: 'Metrics',
    readTime: '7 min read',
    date: 'Mar 2026',
    slug: 'gross-margin-mistakes',
  },
  {
    title: 'AI in Finance Ops: Hype vs. Reality',
    excerpt:
      'What AI can actually do for your finance function today, and what\'s still science fiction. An honest assessment from the trenches.',
    category: 'AI in Finance',
    readTime: '10 min read',
    date: 'Mar 2026',
    slug: 'ai-in-fpa-reality',
  },
  {
    title: 'Monthly MIS: What Founders Should Actually Look At',
    excerpt:
      'Skip the vanity metrics. These are the 8 numbers that actually tell you if your business is healthy or headed for trouble.',
    category: 'Reporting Systems',
    readTime: '9 min read',
    date: 'Feb 2026',
    slug: 'monthly-mis-essentials',
  },
];

export default function Blog() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.blog-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: pageRef.current, start: 'top 80%' },
      });
      gsap.from('.blog-card', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.blog-grid', start: 'top 85%' },
      });
      gsap.from('.blog-cta', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.blog-cta', start: 'top 90%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        {/* Header */}
        <div className="blog-header mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui">
              Resources
            </span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl text-warm mb-4">
            Blog & Resources
          </h1>
          <p className="text-cool leading-relaxed max-w-2xl">
            Practical finance insights for founders. No fluff, no jargon—just
            the stuff that actually helps you make better decisions.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-sm rounded-full border transition-all ${
                index === 0
                  ? 'bg-gold text-navy border-gold'
                  : 'text-cool border-white/10 hover:border-gold/40 hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="blog-card group bg-navy-light border border-white/8 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold font-ui">
                    <Tag size={10} />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-cool font-ui">
                    <Clock size={10} />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-display text-lg text-warm mb-3 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-sm text-cool leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-cool/60">{post.date}</span>
                  <span className="flex items-center gap-1 text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Magnet CTA */}
        <div className="blog-cta p-8 lg:p-10 bg-navy-light border border-white/10 rounded-xl text-center">
          <h2 className="font-display text-2xl text-warm mb-3">
            Get our best content delivered to your inbox
          </h2>
          <p className="text-cool mb-6 max-w-lg mx-auto">
            Join 500+ founders who get our monthly finance brief. One email,
            zero fluff, every month.
          </p>
          <button
            onClick={openLeadMagnet}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5"
          >
            Subscribe + get free Runway Calculator
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
