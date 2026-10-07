import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileBarChart, LayoutDashboard, TrendingUp, Presentation, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: FileBarChart,
    title: 'Reporting Automation',
    shortDesc: 'Clean monthly reporting systems without manual spreadsheet chaos.',
    deliverables: [
      'Monthly MIS and reporting pack setup',
      'P&L structure and account cleanup',
      'Automated reporting templates',
      'Variance commentary framework',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'Investor Dashboards',
    shortDesc: 'Clear visibility into revenue, cash, burn, and runway.',
    deliverables: [
      'Monthly MIS pack',
      'Real-time cash and burn tracker',
      'Board-ready KPI summary',
      'Segment-wise P&L view',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Forecasting',
    shortDesc: 'Forecasting systems that keep pace with how you grow.',
    deliverables: [
      '12-month rolling forecast',
      'Variance analysis with commentary',
      'Scenario planning (Base/Bull/Bear)',
      'Hiring plan financial impact',
    ],
  },
  {
    icon: Presentation,
    title: 'Finance Cleanup',
    shortDesc: 'Investor updates and finance process cleanup done properly.',
    deliverables: [
      'Monthly board deck template',
      'Investor update narrative',
      'Fundraising data room prep',
      'Reporting process and handoff cleanup',
    ],
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;

  void index;

  return (
    <div className="service-block">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
      >
        <div className="flex items-start gap-4 lg:gap-6 p-5 lg:p-6 bg-navy-light/40 border border-white/8 rounded-xl hover:border-gold/30 transition-all duration-300">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Icon size={24} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-warm mb-2">
                  {service.title}
                </h3>
                <p className="text-sm lg:text-base text-cool">
                  {service.shortDesc}
                </p>
              </div>
              <ChevronDown
                size={20}
                className={`text-cool flex-shrink-0 transition-transform duration-300 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                expanded ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-2 border-t border-white/8 pt-4">
                {service.deliverables.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-cool/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-header', {
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

      gsap.from('.service-block', {
        x: -30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services-list',
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
      id="services"
      className="relative py-20 lg:py-28 bg-navy"
      style={{ zIndex: 15 }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-4xl mx-auto">
        <div className="services-header mb-12">
          <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui mb-4 block">
            Services
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-warm mb-4">
            Finance systems built for better decisions.
          </h2>
          <p className="text-cool leading-relaxed max-w-xl">
            A focused operating layer for startups that need better reporting,
            clearer forecasting, cleaner finance processes, and investor-ready materials.
          </p>
        </div>

        <div className="services-list space-y-4">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
