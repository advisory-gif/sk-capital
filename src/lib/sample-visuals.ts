import type { ServiceSample } from './samples';

export type VisualBar = { label: string; value: number; start?: number };
export type CashPoint = { day: number; value: number };
export type VisualModel = {
  kind: 'stack' | 'cash' | 'bars' | 'workflow' | 'bridge' | 'dashboard';
  title: string; takeaway: string; next: string; note: string;
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
  switch (sample.id) {
    case 'margin-check': {
      const revenue = sum(sample, 'revenue'), costs = sum(sample, 'directCosts');
      return { kind: 'stack', title: 'Sales → delivery costs → money left', bars: [{ label: 'Delivery costs', value: costs }, { label: 'Money left', value: revenue - costs }], max: revenue,
        takeaway: '$50,000 in sales leaves $12,000 after delivery costs.', next: 'Check delivery costs before your next quote.', note: 'Before overheads and tax. This is not final profit.' };
    }
    case 'four-week-cash': return { kind: 'cash', title: 'A late payment creates a cash gap', base: cashPath(sample), delayed: cashPath(sample, true), min: -20000, max: 60000,
      takeaway: 'Both cases end at $35,000. But a late receipt leaves a $10,000 shortfall on 20 November.', next: 'Confirm the receipt date and a backup plan.', note: '2–29 Nov 2026 · Balance after each listed transaction. Unlisted cash movements are excluded.' };
    case 'plan-vs-actual': {
      const bars = sample.scenario.rows.map(row => ({ label: row.category === 'Sales' ? 'Sales below plan' : `Extra ${row.category === 'Direct costs' ? 'delivery costs' : String(row.category).toLowerCase()}`, value: Math.abs(number(row.actual) - number(row.planned)) }));
      return { kind: 'bars', title: 'What explains the $23,000 gap?', bars, min: 0, max: 15000,
        takeaway: 'Lower sales explain most of the $23,000 gap.', next: 'Start by checking what changed in sales.', note: 'Less money left than planned, after the listed costs. Two months combined.' };
    }
    case 'ai-finance-workflow': return { kind: 'workflow', title: 'From spreadsheet to a checked first draft',
      takeaway: 'AI helps with the first draft. A person checks it before use.', next: 'Use approved data and tools, with a named reviewer.', note: 'This sample is prewritten, not a live AI chat.' };
    case 'plan-hire-expansion': {
      const base = rows[0], rate = (number(base.revenue) - number(base.directCosts)) / number(base.revenue);
      const needed = number(rows[1].hireCost) / rate;
      return { kind: 'bars', title: 'How much extra sales does a hire need?', bars: [{ label: 'Expected extra sales', value: number(rows[1].revenue) - number(base.revenue) }, { label: 'Lower-sales scenario', value: number(rows[2].revenue) - number(base.revenue) }], min: 0, max: needed * 1.25, reference: needed,
        takeaway: 'If half of each sale is left after delivery, $60,000 in extra monthly sales covers a $30,000 hire.', next: 'Test how quickly those extra sales could arrive.', note: 'Monthly sales, not cash. One-time setup costs are shown in the details.' };
    }
    case 'understand-cash-profit': {
      let running = 0;
      const labels = ['Profit shown', 'Sales not collected', 'Supplier bills not paid', 'Extra stock bought', 'Change in cash'];
      const bars = sample.scenario.rows.map((row, index) => { const value = number(row.cashEffect), start = index === 0 || index === 4 ? 0 : running; if (index < 4) running += value; return { label: labels[index], start, value }; });
      return { kind: 'bridge', title: 'Profit can still mean cash going out', bars, min: -20000, max: 30000,
        takeaway: 'The accounts show $30,000 profit, yet cash falls by $15,000.', next: 'Check collections, unpaid bills and stock purchases.', note: 'Profit excludes unlisted costs and tax. Cash ends at $35,000, down from $50,000.' };
    }
    case 'assess-marketing': return { kind: 'bars', title: 'What is left after the ad spend?', bars: rows.map(row => ({ label: String(row.channel), value: number(row.revenue) - number(row.directCosts) - number(row.spend) })), min: -2000, max: 6000,
      takeaway: 'Search leaves $6,000. Social is $800 short after delivery and ad costs.', next: 'Check full costs and repeat purchases before changing spend.', note: 'From first purchases, after direct costs and ads. Before overheads and tax; repeat purchases are excluded.' };
    default: {
      const previousMargin = (number(rows[0].previous) - number(rows[1].previous)) / number(rows[0].previous) * 100;
      const currentMargin = (number(rows[0].current) - number(rows[1].current)) / number(rows[0].current) * 100;
      return { kind: 'dashboard', title: 'Growth is only one part of the picture', tiles: [
        { label: 'Sales', previous: number(rows[0].previous), current: number(rows[0].current), format: 'currency', change: '+20%', max: 120000 },
        { label: 'Share left after delivery costs', previous: previousMargin, current: currentMargin, format: 'percent', change: '−5 percentage points', max: 100 },
        { label: 'Overdue customer payments', previous: number(rows[2].previous), current: number(rows[2].current), format: 'currency', change: '+$15,000', max: 25000 },
      ], takeaway: 'Sales are up. Less is left from each dollar, and more money is overdue from customers.', next: 'Give each warning sign an owner and a follow-up question.', note: 'Previous month → Current month. Money left is before overheads and tax.' };
    }
  }
}
