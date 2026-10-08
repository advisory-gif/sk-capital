import type { ServiceSample } from './samples';
import chartCopy from '@/data/sample-chart-copy.json';

export type VisualBar = { label: string; value: number; start?: number; tone?: 'negative' };
export type CashPoint = { day: number; value: number };
export type VisualModel = {
  kind: 'stack' | 'cash' | 'bars' | 'workflow' | 'bridge' | 'dashboard';
  title: string; note: string;
  legendLabels?: string[]; lowLabel?: string; accessibleDescription?: string; referenceText?: string;
  steps?: { title: string; text: string }[];
  bars?: VisualBar[]; min?: number; max?: number; reference?: number;
  base?: CashPoint[]; delayed?: CashPoint[];
  tiles?: { label: string; previous: number; current: number; format: string; change: string; max: number }[];
};

const number = (value: string | number) => Number(value);
const sum = (sample: ServiceSample, key: string) => sample.inputs.rows.reduce((total, row) => total + number(row[key]), 0);
export function cashPath(sample: ServiceSample, delayed = false): CashPoint[] {
  const start = Date.parse('2026-11-02');
  const events = sample.inputs.rows.map(row => ({ day: (Date.parse(delayed && row.item === 'Customer receipt C' ? '2026-11-26' : String(row.date)) - start) / 86400000, amount: number(row.amount) * (row.direction === 'In' ? 1 : -1) })).sort((a, b) => a.day - b.day);
  let value = sample.metrics[0].value;
  const points = [{ day: 0, value }];
  for (const event of events) { value += event.amount; points.push({ day: event.day, value }); }
  points.push({ day: 27, value });
  return points;
}

export function sampleVisual(sample: ServiceSample): VisualModel {
  const rows = sample.inputs.rows;
  const copy = chartCopy[sample.id as keyof typeof chartCopy] as {
    title: string; note: string; barLabels?: string[]; legendLabels?: string[]; lowLabel?: string;
    accessibleDescription?: string; referenceText?: string; steps?: { title: string; text: string }[];
    tileLabels?: string[];
  };
  switch (sample.id) {
    case 'margin-check': {
      const revenue = sum(sample, 'revenue'), costs = sum(sample, 'directCosts');
      return { kind: 'stack', ...copy, bars: [{ label: copy.barLabels![0], value: costs }, { label: copy.barLabels![1], value: revenue - costs }], max: revenue };
    }
    case 'four-week-cash': return { kind: 'cash', ...copy, base: cashPath(sample), delayed: cashPath(sample, true), min: -20000, max: 60000 };
    case 'plan-vs-actual': {
      const bars = sample.scenario.rows.map((row, index) => ({ label: copy.barLabels![index], value: Math.abs(number(row.actual) - number(row.planned)), tone: 'negative' as const }));
      return { kind: 'bars', ...copy, bars, min: 0, max: 15000 };
    }
    case 'ai-finance-workflow': return { kind: 'workflow', ...copy };
    case 'plan-hire-expansion': {
      const base = rows[0], rate = (number(base.revenue) - number(base.directCosts)) / number(base.revenue);
      const needed = number(rows[1].hireCost) / rate;
      return { kind: 'bars', ...copy, bars: [{ label: copy.barLabels![0], value: number(rows[1].revenue) - number(base.revenue) }, { label: copy.barLabels![1], value: number(rows[2].revenue) - number(base.revenue) }], min: 0, max: needed * 1.25, reference: needed };
    }
    case 'understand-cash-profit': {
      let running = 0;
      const labels = copy.barLabels!;
      const bars = sample.scenario.rows.map((row, index) => { const value = number(row.cashEffect), start = index === 0 || index === 4 ? 0 : running; if (index < 4) running += value; return { label: labels[index], start, value }; });
      return { kind: 'bridge', ...copy, bars, min: -20000, max: 30000 };
    }
    case 'assess-marketing': return { kind: 'bars', ...copy, bars: rows.map((row, index) => ({ label: copy.barLabels![index], value: number(row.revenue) - number(row.directCosts) - number(row.spend) })), min: -2000, max: 6000 };
    default: {
      const previousMargin = (number(rows[0].previous) - number(rows[1].previous)) / number(rows[0].previous) * 100;
      const currentMargin = (number(rows[0].current) - number(rows[1].current)) / number(rows[0].current) * 100;
      return { kind: 'dashboard', ...copy, tiles: [
        { label: copy.tileLabels![0], previous: number(rows[0].previous), current: number(rows[0].current), format: 'currency', change: '+20%', max: 120000 },
        { label: copy.tileLabels![1], previous: previousMargin, current: currentMargin, format: 'currency', change: '$5 less per $100', max: 100 },
        { label: copy.tileLabels![2], previous: number(rows[2].previous), current: number(rows[2].current), format: 'currency', change: '+$15,000', max: 25000 },
      ] };
    }
  }
}
