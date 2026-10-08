import data from '@/data/service-samples.json';

export type ExampleTable = {
  columns: { key: string; label: string; format: string }[];
  rows: Record<string, string | number>[];
  note: string;
};
export type ServiceSample = {
  id: string; name: string; category: string; question: string; scope: string;
  problem: string; inputLabel: string; inputs: ExampleTable;
  metrics: { label: string; value: number; format: string; detail: string }[];
  finding: string; nextStep: string; draftCommentary?: string;
  qa: { question: string; answer: string }[];
  scenario: ExampleTable & { title: string; description: string };
  deliverables: string[]; cautions: string[]; calculationNotes: string[];
};
export const samples = data as ServiceSample[];
export const findSample = (id?: string) => samples.find(sample => sample.id === id);
export const exampleCurrencyNote = 'All example amounts are INR (₹). These are fictional business figures, not service prices or currency conversions.';
export function formatExample(value: string | number, format: string) {
  if (typeof value !== 'number') return value;
  const number = Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const sign = value < 0 ? '−' : '';
  return format === 'currency' ? `${sign}₹${number}` : format === 'percent' ? `${sign}${number}%` : `${sign}${number}`;
}
