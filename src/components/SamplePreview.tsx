import { ArrowRight } from 'lucide-react';
import { Bars, Workflow } from './SampleVisual';
import { sampleVisual } from '@/lib/sample-visuals';
import type { ServiceSample } from '@/lib/samples';
import { formatExample } from '@/lib/samples';

const money = (value: number) => formatExample(value, 'currency');

export default function SamplePreview({ sample }: { sample: ServiceSample }) {
  const model = sampleVisual(sample);
  if (model.kind === 'workflow') return <div className="sample-preview preview-workflow"><Workflow model={model} /></div>;
  if (model.kind === 'stack') return <div className="sample-preview" role="img" aria-label="$50,000 sales: $38,000 delivery costs and $12,000 left before other running costs and tax.">
    <p className="preview-caption">{money(model.max!)} in sales</p>
    <div className="contribution-stack">{model.bars!.map((bar, index) => <span key={bar.label} className={index === 1 ? 'contribution-left' : ''} style={{ width: `${bar.value / model.max! * 100}%` }} />)}</div>
    <div className="stack-labels">{model.bars!.map((bar, index) => <div key={bar.label}><span><i className={index === 1 ? 'contribution-left' : ''} /> {bar.label}</span><strong>{money(bar.value)}</strong></div>)}</div>
    <p className="preview-note">Before other running costs and tax</p>
  </div>;
  if (model.kind === 'dashboard') return <div className="sample-preview preview-reporting" aria-label="Previous month compared with current month">
    {model.tiles!.map(tile => <div key={tile.label}><span>{tile.label}</span><p><span>{formatExample(tile.previous, tile.format)}</span><ArrowRight size={18} aria-label="to" /><strong>{formatExample(tile.current, tile.format)}</strong></p></div>)}
    <p className="preview-note">Previous → current month; before shared costs and tax</p>
  </div>;
  if (sample.id === 'plan-hire-expansion') return <div className="sample-preview preview-hire">
    <div><span>Monthly hire cost</span><strong>{money(sample.metrics[0].value)}</strong></div><ArrowRight aria-hidden="true" /><div><span>Extra monthly sales needed</span><strong>{money(model.reference!)}</strong></div>
    <p className="preview-note">At 50% left after delivery; setup is extra</p>
  </div>;
  let bars = model.bars ?? [], caption = model.title, min = model.min ?? 0, max = model.max ?? 1, note = model.note;
  if (model.kind === 'cash') {
    bars = [{ label: 'Customer pays on time', value: Math.min(...model.base!.map(point => point.value)) }, { label: 'Customer pays 10 days late', value: Math.min(...model.delayed!.map(point => point.value)) }];
    caption = 'Lowest cash balance'; min = -10000; max = 15000; note = 'Late payment leaves a $10,000 gap on 20 Nov';
  } else if (sample.id === 'plan-vs-actual') {
    bars = [{ label: 'Planned', value: sample.metrics[0].value }, { label: 'Actual', value: sample.metrics[1].value }];
    caption = 'Left after the listed costs'; min = 0; max = sample.metrics[0].value; note = 'Two months combined';
  } else if (model.kind === 'bridge') {
    bars = [{ label: 'Profit from listed items', value: sample.metrics[0].value }, { label: 'Change in bank balance', value: sample.metrics[1].value }];
    caption = 'Profit is not cash'; min = -15000; max = 30000; note = 'Listed items only, before tax';
  }
  return <div className="sample-preview"><p className="preview-caption">{caption}</p><Bars model={{ kind: 'bars', title: caption, note, bars, min, max }} /><p className="preview-note">{note}</p></div>;
}
