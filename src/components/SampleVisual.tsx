import { ArrowDown, CheckCircle2, FileText, Table2 } from 'lucide-react';
import { formatExample } from '@/lib/samples';
import type { CashPoint, VisualModel } from '@/lib/sample-visuals';

const money = (value: number) => formatExample(value, 'currency');

function Bars({ model }: { model: VisualModel }) {
  const min = model.min ?? 0, max = model.max ?? 1, range = max - min;
  const position = (value: number) => (value - min) / range * 100;
  const bars = model.bars ?? [];
  const label = bars.map(bar => `${bar.label}: ${money(bar.value)}`).join('. ');
  return <div className="visual-bars" role="img" aria-label={label} data-min={min} data-max={max}>
    {model.reference !== undefined && <p className="chart-reference">Dashed line: {money(model.reference)} extra sales needed to cover the hire.</p>}
    {bars.map((bar, index) => {
      const start = bar.start ?? 0, end = start + bar.value;
      return <div className="visual-bar-row" key={bar.label}>
        <div className="visual-bar-label"><span>{bar.label}</span><strong>{bar.value > 0 && model.kind === 'bridge' && index > 0 && index < 4 ? '+' : ''}{money(bar.value)}</strong></div>
        <div className="visual-bar-track">
          <span className="chart-zero" style={{ left: `${position(0)}%` }} />
          {model.reference !== undefined && <span className="chart-break-even" style={{ left: `${position(model.reference)}%` }} />}
          <span className={`visual-bar ${bar.value < 0 ? 'visual-bar-negative' : ''}`} data-value={bar.value} data-start={start} data-end={end} style={{ left: `${position(Math.min(start, end))}%`, width: `${Math.abs(bar.value) / range * 100}%` }} />
        </div>
      </div>;
    })}
    <div className="chart-scale" aria-hidden="true"><span>{money(min)}</span><span>{money(max)}</span>{min < 0 && <span className="chart-scale-zero" style={{ left: `${position(0)}%` }}>0</span>}</div>
  </div>;
}

function CashChart({ model }: { model: VisualModel }) {
  const base = model.base ?? [], delayed = model.delayed ?? [];
  const min = model.min ?? -20000, max = model.max ?? 60000;
  const y = (value: number) => (max - value) / (max - min) * 200;
  const x = (day: number) => day / 27 * 500;
  const path = (points: CashPoint[]) => points.map((point, index) => index === 0 ? `M${x(point.day)},${y(point.value)}` : `H${x(point.day)}V${y(point.value)}`).join(' ');
  const lowest = delayed.reduce((a, b) => b.value < a.value ? b : a);
  return <div>
    <div className="cash-legend"><span><i /> On-time receipt</span><span><i className="cash-delayed-key" /> Late receipt</span></div>
    <div className="cash-chart">
      <div className="cash-axis" aria-hidden="true">{[60000, 40000, 20000, 0, -20000].map(value => <span key={value} style={{ top: `${y(value) / 2}%` }}>{value < 0 ? '−' : ''}${Math.abs(value) / 1000}k</span>)}</div>
      <div className="cash-plot">
        <svg viewBox="0 0 500 200" preserveAspectRatio="none" role="img" aria-labelledby="cash-chart-title cash-chart-description">
          <title id="cash-chart-title">Cash balance with an on-time or late receipt</title>
          <desc id="cash-chart-description">Balance after each fictional transaction from 2 to 29 November 2026. Opening cash is $30,000. The on-time case stays at or above $15,000. With the receipt delayed, cash falls to minus $10,000 on 20 November. Both cases close at $35,000. Full transaction figures are in Show details.</desc>
          <rect x="0" y={y(0)} width="500" height={200 - y(0)} fill="#fbebe4" />
          {[60000, 40000, 20000, 0, -20000].map(value => <line key={value} x1="0" x2="500" y1={y(value)} y2={y(value)} stroke={value === 0 ? '#58665b' : '#d9dfd6'} vectorEffect="non-scaling-stroke" />)}
          <path data-series="on-time" d={path(base)} fill="none" stroke="#276b43" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <path data-series="late" d={path(delayed)} fill="none" stroke="#963e22" strokeWidth="3" strokeDasharray="7 5" vectorEffect="non-scaling-stroke" />
          <circle data-cash-low={lowest.value} data-day={lowest.day} cx={x(lowest.day)} cy={y(lowest.value)} r="5" fill="#963e22" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="cash-dates" aria-hidden="true">{[0, 7, 14, 21, 27].map((day, index) => <span key={day} style={{ left: `${day / 27 * 100}%`, transform: index === 0 ? 'none' : index === 4 ? 'translateX(-100%)' : 'translateX(-50%)' }}>{day + 2} Nov</span>)}</div>
      </div>
    </div>
    <p className="cash-shortfall">Lowest late-payment balance: <strong>{money(lowest.value)} on 20 Nov</strong></p>
  </div>;
}

function Workflow() {
  return <ol className="workflow-track" aria-label="Illustrated workflow: approved spreadsheet, first draft, human check">
    {[{ title: 'Your spreadsheet', text: 'Use an agreed template.', Icon: Table2 }, { title: 'A first draft', text: 'Turn numbers into a short update.', Icon: FileText }, { title: 'A human check', text: 'Check the numbers and explanation.', Icon: CheckCircle2 }].map(({ title, text, Icon }, index) => <li key={title}><div className="workflow-step"><Icon size={30} strokeWidth={1.5} aria-hidden="true" /><span className="workflow-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>{index < 2 && <ArrowDown className="workflow-arrow" aria-hidden="true" size={22} />}</li>)}
  </ol>;
}

export default function SampleVisual({ model }: { model: VisualModel }) {
  return <figure className="sample-visual" aria-labelledby="visual-title">
    <figcaption id="visual-title" className="visual-title">{model.title}</figcaption>
    {model.kind === 'stack' && <div role="img" aria-label="$50,000 in sales pays $38,000 in delivery costs, leaving $12,000 before overheads and tax.">
      <div className="contribution-stack">{(model.bars ?? []).map((bar, index) => <span key={bar.label} data-value={bar.value} className={index === 1 ? 'contribution-left' : ''} style={{ width: `${bar.value / (model.max ?? 1) * 100}%` }} />)}</div>
      <div className="stack-labels">{(model.bars ?? []).map((bar, index) => <div key={bar.label}><span><i className={index === 1 ? 'contribution-left' : ''} /> {bar.label}</span><strong>{money(bar.value)}</strong></div>)}</div>
    </div>}
    {(model.kind === 'bars' || model.kind === 'bridge') && <Bars model={model} />}
    {model.kind === 'cash' && <CashChart model={model} />}
    {model.kind === 'workflow' && <Workflow />}
    {model.kind === 'dashboard' && <div className="reporting-dashboard">{(model.tiles ?? []).map(tile => <div key={tile.label} className="reporting-tile"><h3>{tile.label}</h3><p className="reporting-change">{tile.change}</p><div role="img" aria-label={`${tile.label}: previous ${formatExample(tile.previous, tile.format)}, current ${formatExample(tile.current, tile.format)}. ${tile.change}.`}>
      {(['previous', 'current'] as const).map(period => <div key={period} className="dashboard-period"><span>{period === 'previous' ? 'Previous' : 'Current'} <strong>{formatExample(tile[period], tile.format)}</strong></span><div><i data-value={tile[period]} data-max={tile.max} style={{ width: `${tile[period] / tile.max * 100}%` }} /></div></div>)}
    </div></div>)}</div>}
    <p className="chart-note">{model.note}</p>
  </figure>;
}
