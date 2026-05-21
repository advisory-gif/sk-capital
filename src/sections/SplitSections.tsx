import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: 'investor-grade',
    headline: ['Forecasting systems', 'built for growth.'],
    body: 'We build finance reporting and forecasting systems that help founders stay ahead of cash, runway, and growth decisions.',
    cta: { text: 'Explore services', href: '/#services' },
    image: '/images/macro-lens.jpg',
    imagePosition: 'right',
  },
  {
    id: 'monthly-reporting',
    headline: ['Monthly reporting', 'that actually', 'makes sense.'],
    body: 'A clean monthly reporting pack with variance commentary, cash flow tracking, and the next three actions that matter.',
    cta: { text: 'See a sample report', href: '/portfolio' },
    image: '/images/keyboard.jpg',
    imagePosition: 'left',
  },
  {
    id: 'less-spreadsheets',
    headline: ['Spend less time', 'on spreadsheets.'],
    body: 'We handle finance process cleanup, data structuring, and first-draft commentary so you can focus on decisions.',
    cta: { text: 'How we work', href: '/how-we-use-ai' },
    image: '/images/smartphone.jpg',
    imagePosition: 'right',
  },
  {
    id: 'built-founders',
    headline: ['Built for', 'founders.'],
    body: 'We speak founder and finance. No jargon. No vanity metrics. Just the numbers you need to raise, operate, and sleep better.',
    cta: { text: 'Meet the team', href: '/#team' },
    image: '/images/portrait.jpg',
    imagePosition: 'left',
  },
];

function SplitSection({
  section,
  index,
}: {
  section: (typeof sections)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !imageRef.current) return;

    const isImageRight = section.imagePosition === 'right';

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: isImageRight ? -60 : 60,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'top 35%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(imageRef.current, {
        x: isImageRight ? 60 : -60,
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [section.imagePosition]);

  const isImageRight = section.imagePosition === 'right';

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] lg:min-h-screen flex items-center py-16 lg:py-0"
      style={{ zIndex: 10 + index }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div
          className={`flex flex-col ${
            isImageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
          } items-center gap-12 lg:gap-16`}
        >
          {/* Text Panel */}
          <div ref={textRef} className="w-full lg:w-1/2">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-warm leading-[1.05] mb-6">
              {section.headline.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-base lg:text-lg text-cool leading-relaxed max-w-lg mb-8">
              {section.body}
            </p>
            <Link
              to={section.cta.href}
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors group"
            >
              <span className="relative">
                {section.cta.text}
                <span className="absolute bottom-0 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image Panel */}
          <div ref={imageRef} className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={section.image}
                alt={section.headline.join(' ')}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SplitSections() {
  return (
    <div className="relative">
      {sections.map((section, index) => (
        <SplitSection key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
