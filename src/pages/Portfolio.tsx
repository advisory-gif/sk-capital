import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Info, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'pl', label: 'P&L' },
  { id: 'unit-economics', label: 'Unit Economics' },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'scenarios', label: 'Scenario Analysis' },
];

const kpiData = {
  overview: [
    { label: 'ARR FY2029E', value: '$16.1M', change: '+39.7% YoY', trend: 'up' },
    { label: 'Gross Margin', value: '82.5%', change: '+1.1pp YoY', trend: 'up' },
    { label: 'EBITDA FY2029E', value: '$4.2M', change: '+$1.9M vs FY28', trend: 'up' },
    { label: 'Total Customers', value: '1,920', change: '+275 net new', trend: 'up' },
    { label: 'LTV:CAC', value: '6.7x', change: 'Target >3x', trend: 'up' },
    { label: 'Closing Cash', value: '$17.1M', change: 'FCF positive', trend: 'up' },
  ],
  revenue: [
    { label: 'ARR', value: '$16.1M', change: '+39.7% YoY', trend: 'up' },
    { label: 'MRR', value: '$1.34M', change: '+3.2% MoM', trend: 'up' },
    { label: 'ARPU', value: '$8,385', change: '+5.1% YoY', trend: 'up' },
    { label: 'Net Revenue Retention', value: '118%', change: '+3pp YoY', trend: 'up' },
    { label: 'New ARR', value: '$4.6M', change: '+22% YoY', trend: 'up' },
    { label: 'Expansion ARR', value: '$2.1M', change: '+35% YoY', trend: 'up' },
  ],
  pl: [
    { label: 'Revenue', value: '$16.1M', change: '+39.7% YoY', trend: 'up' },
    { label: 'Gross Profit', value: '$13.3M', change: '+41.2% YoY', trend: 'up' },
    { label: 'Gross Margin', value: '82.5%', change: '+1.1pp', trend: 'up' },
    { label: 'OpEx', value: '$9.8M', change: '+28% YoY', trend: 'down' },
    { label: 'EBITDA', value: '$4.2M', change: '+82% YoY', trend: 'up' },
    { label: 'EBITDA Margin', value: '26.1%', change: '+6.2pp', trend: 'up' },
  ],
  'unit-economics': [
    { label: 'CAC', value: '$4,200', change: '-8% YoY', trend: 'up' },
    { label: 'LTV', value: '$28,140', change: '+12% YoY', trend: 'up' },
    { label: 'LTV:CAC', value: '6.7x', change: '+0.8x', trend: 'up' },
    { label: 'Payback Period', value: '8.2 mo', change: '-1.3 mo', trend: 'up' },
    { label: 'Magic Number', value: '1.4', change: '+0.2', trend: 'up' },
    { label: 'Gross Margin', value: '82.5%', change: '+1.1pp', trend: 'up' },
  ],
  cashflow: [
    { label: 'Operating CF', value: '$3.8M', change: '+$1.5M', trend: 'up' },
    { label: 'Free Cash Flow', value: '$2.4M', change: '+$1.8M', trend: 'up' },
    { label: 'Cash Balance', value: '$17.1M', change: '+$2.4M', trend: 'up' },
    { label: 'Burn Rate (monthly)', value: '$0.2M', change: 'FCF positive', trend: 'up' },
    { label: 'Runway', value: '∞', change: 'Self-sustaining', trend: 'up' },
    { label: 'CapEx', value: '$0.4M', change: '-$0.1M', trend: 'up' },
  ],
  scenarios: [
    { label: 'Bear Case ARR', value: '$12.8M', change: '-20% from base', trend: 'down' },
    { label: 'Base Case ARR', value: '$16.1M', change: 'Planned', trend: 'neutral' },
    { label: 'Bull Case ARR', value: '$20.5M', change: '+27% from base', trend: 'up' },
    { label: 'Bear EBITDA', value: '$2.1M', change: 'Still profitable', trend: 'neutral' },
    { label: 'Base EBITDA', value: '$4.2M', change: 'Planned', trend: 'neutral' },
    { label: 'Bull EBITDA', value: '$6.8M', change: '+62% from base', trend: 'up' },
  ],
};

// Simple SVG chart component
function SimpleChart({ type, color = '#D6A434' }: { type: 'line' | 'bar'; color?: string }) {
  if (type === 'line') {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-16">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points="0,50 30,45 60,38 90,35 120,28 150,20 180,12 200,8"
        />
        <circle cx="200" cy="8" r="3" fill={color} />
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#areaGrad)"
          points="0,50 30,45 60,38 90,35 120,28 150,20 180,12 200,8 200,60 0,60"
        />
      </svg>
    );
  }
  const bars = [35, 42, 38, 50, 48, 55, 60, 58, 65, 72, 70, 78];
  return (
    <svg viewBox="0 0 200 60" className="w-full h-16">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 16 + 2}
          y={60 - h}
          width="12"
          height={h}
          rx="2"
          fill={color}
          opacity={i === bars.length - 1 ? 1 : 0.5}
        />
      ))}
    </svg>
  );
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('overview');
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: pageRef.current, start: 'top 80%' },
      });
      gsap.from('.portfolio-dashboard', {
        y: 60, opacity: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.portfolio-dashboard', start: 'top 85%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const kpis = kpiData[activeTab as keyof typeof kpiData] || kpiData.overview;

  return (
    <div ref={pageRef} className="pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12 xl:px-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="portfolio-header text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-gold/50" />
            <span className="text-xs uppercase tracking-[0.18em] text-gold font-ui">
              Portfolio
            </span>
            <div className="w-8 h-px bg-gold/50" />
          </div>
          <h1 className="font-display text-3xl lg:text-5xl text-warm mb-4">
            See what our work actually looks like.
          </h1>
          <p className="text-xl text-gold font-display mb-4">
            Not slides. Real models.
          </p>
          <p className="text-cool max-w-2xl mx-auto">
            Below is a sanitised version of a full reporting and forecasting
            system we built for a B2B SaaS company. Revenue build, P&amp;L,
            unit economics, cash flow, scenarios. This is the kind of output
            our clients get every month.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-navy-light border border-white/8 rounded-lg mb-8 max-w-3xl mx-auto">
          <Info size={18} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-cool">
            <span className="text-gold font-medium">Sample model for illustration.</span>{' '}
            CloudHR SaaS is a fictional company. All numbers, assumptions, and
            insights shown are illustrative and do not represent any real client.
            Built to demonstrate the depth and quality of our finance systems work.
          </p>
        </div>

        {/* Mobile notice */}
        <div className="lg:hidden p-3 bg-gold/10 border border-gold/20 rounded-lg mb-6 text-center">
          <p className="text-xs text-gold">
            View on desktop for the full interactive dashboard experience.
          </p>
        </div>

        {/* Dashboard */}
        <div className="portfolio-dashboard bg-navy-light border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-white/8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-xl text-warm mb-1">
                  Interactive Finance Dashboard
                </h3>
                <p className="text-xs text-cool">
                  B2B HR SaaS | FY2024A to FY2029E | Illustrative sample
                </p>
              </div>
              <span className="text-xs text-cool bg-white/5 px-3 py-1 rounded-full">
                Model v1.0 · Apr 2026
              </span>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 pb-2 -mx-1 px-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-gold text-navy font-medium'
                      : 'text-cool hover:text-warm hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="p-4 bg-navy/50 border border-white/5 rounded-lg hover:border-gold/20 transition-all"
                >
                  <div className="text-xs text-cool mb-1">{kpi.label}</div>
                  <div className="text-xl lg:text-2xl font-display text-warm mb-1">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-1">
                    {kpi.trend === 'up' && <TrendingUp size={12} className="text-emerald-400" />}
                    {kpi.trend === 'down' && <TrendingDown size={12} className="text-red-400" />}
                    {kpi.trend === 'neutral' && <Minus size={12} className="text-cool" />}
                    <span
                      className={`text-xs ${
                        kpi.trend === 'up'
                          ? 'text-emerald-400'
                          : kpi.trend === 'down'
                          ? 'text-red-400'
                          : 'text-cool'
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-navy/50 border border-white/5 rounded-lg">
                <h4 className="text-sm text-cool mb-4">
                  Revenue vs EBITDA ($000s)
                </h4>
                <SimpleChart type="line" />
              </div>
              <div className="p-4 bg-navy/50 border border-white/5 rounded-lg">
                <h4 className="text-sm text-cool mb-4">
                  Gross margin % and EBITDA margin %
                </h4>
                <SimpleChart type="bar" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-cool mb-6">
            Want to see how this applies to your startup?
          </p>
          <a
            href="/business-health-review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-navy font-medium rounded-full hover:bg-gold/90 transition-all hover:-translate-y-0.5"
          >
            Start your Business Health Review
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
