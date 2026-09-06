import { useEffect, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: 'Snesh Kakkar',
    initials: 'SK',
    role: 'Co-founder, SK Capital',
    bio: 'Snesh brings experience across strategic finance, forecasting and business partnering. As Manager – FP&A at UltraViolet Cyber, he works on annual planning, revenue and cost forecasts, executive reporting and decision support. His earlier roles at TriNet, American Express and Amazon span financial analysis, operational forecasting and reporting automation.',
    education: 'BBA, Finance · Uttaranchal University',
    linkedin: 'https://www.linkedin.com/in/sneshkakkar/',
    image: '/images/team/snesh-kakkar.jpg',
  },
  {
    name: 'Megha Dalmia',
    initials: 'MD',
    role: 'Co-founder, SK Capital',
    bio: 'Megha works across FP&A, management reporting and client economics. At TriNet, she supports stakeholders in the US and India with planning, operating expense forecasts, variance analysis and profitability insights. Her work connects cost-to-serve, resource planning and Power BI reporting to practical business decisions.',
    education: 'MBA, Finance · BML Munjal University; BCom, Accounting & Finance',
    linkedin: 'https://www.linkedin.com/in/megha-dalmia/',
    image: '/images/team/megha-dalmia.jpg',
  },
];

function handleFounderImageError(event: SyntheticEvent<HTMLImageElement>, initials: string) {
  const img = event.currentTarget;
  img.style.display = 'none';
  const fallback = img.nextElementSibling as HTMLDivElement | null;
  if (fallback) {
    fallback.classList.remove('hidden');
    fallback.classList.add('flex');
    fallback.textContent = initials;
  }
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-header', {
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

      gsap.from('.team-member', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.team-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.team-quote', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.team-quote',
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
      id="team"
      className="relative py-20 lg:py-28 bg-navy"
      style={{ zIndex: 15 }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        <div className="team-header mb-12">
          <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui mb-4 block">
            Who We Are
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-warm">
            The people behind SK Capital.
          </h2>
        </div>

        <div className="team-grid grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {team.map((member, index) => (
            <div
              key={index}
              className="team-member flex flex-col sm:flex-row gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-xl overflow-hidden border border-white/10 bg-navy-light">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(event) => handleFounderImageError(event, member.initials)}
                  />
                  <div className="hidden w-full h-full items-center justify-center bg-navy-light text-gold font-display text-2xl">
                    {member.initials}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-display text-xl text-warm">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gold">{member.role}</p>
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin size={16} className="text-cool hover:text-gold transition-colors" />
                  </a>
                </div>
                <p className="text-xs text-cool/60 font-ui uppercase tracking-wider mb-3">
                  {member.education}
                </p>
                <p className="text-sm text-cool leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: Add real founder headshots at /public/images/team/snesh-kakkar.jpg and /public/images/team/megha-dalmia.jpg */}
        <div className="team-quote border-l-2 border-gold pl-6 max-w-2xl">
          <p className="text-lg text-warm/80 font-display italic leading-relaxed">
            We work at the intersection of finance, data, and decision-making.
            Our job is to make sure your numbers are not just accurate, but
            useful enough to act on.
          </p>
        </div>
      </div>
    </section>
  );
}
