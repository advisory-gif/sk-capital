import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
const { outputFiles } = await build({ entryPoints: ['src/lib/sample-visuals.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { sampleVisual } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const data = JSON.parse(await readFile('src/data/service-samples.json', 'utf8'));
const models = Object.fromEntries(data.map(sample => [sample.id, sampleVisual(sample)]));
test('all eight examples have a short takeaway, one focused visual and bounded geometry', () => {
  assert.equal(Object.keys(models).length, 8);
  for (const [id, model] of Object.entries(models)) {
    assert.ok(model.title && model.takeaway && model.next && model.note, id);
    assert.ok((model.takeaway + model.next).split(/\s+/).length < 70, id);
    if (model.bars) for (const bar of model.bars) {
      assert.ok(Number.isFinite(bar.value), id);
      assert.ok((bar.start ?? 0) >= (model.min ?? 0), id);
      assert.ok((bar.start ?? 0) <= model.max, id);
      assert.ok((bar.start ?? 0) + bar.value >= (model.min ?? 0), id);
      assert.ok((bar.start ?? 0) + bar.value <= model.max, id);
    }
  }
});
test('margin stack shows direct costs and contribution as true shares of total revenue', () => {
  const m = models['margin-check'];
  assert.deepEqual(m.bars.map(row => row.value), [38000, 12000]);
  assert.equal(m.bars.reduce((sum, row) => sum + row.value, 0), m.max);
  assert.equal(m.bars[1].value / m.max, .24);
});
test('cash chart plots every event, opening and closing balances and the within-period shortfall', () => {
  const m = models['four-week-cash'];
  assert.equal(m.base.length, 10); assert.equal(m.delayed.length, 10);
  assert.deepEqual(m.base[0], { day: 0, value: 30000 });
  assert.deepEqual(m.delayed.at(-1), { day: 27, value: 35000 });
  assert.equal(m.base.at(-1).value, 35000);
  assert.deepEqual(m.delayed.find(point => point.day === 18), { day: 18, value: -10000 });
  assert.equal(Math.min(...m.base.map(point => point.value)), 15000);
  assert.equal(Math.min(...m.delayed.map(point => point.value)), -10000);
  for (const series of [m.base, m.delayed]) {
    for (const point of series) { assert.ok(point.value >= m.min && point.value <= m.max); assert.ok(point.day >= 0 && point.day <= 27); }
    assert.deepEqual(series.map(point => point.day), series.map(point => point.day).sort((a, b) => a - b));
  }
});
test('plan gap has three correctly calculated, additive unfavourable drivers', () => {
  const m = models['plan-vs-actual'];
  assert.deepEqual(m.bars.map(row => row.value), [15000, 6000, 2000]);
  assert.equal(m.bars.reduce((sum, row) => sum + row.value, 0), 45000 - 22000);
});
test('AI sample is a process illustration rather than a fabricated performance chart', () => {
  assert.equal(models['ai-finance-workflow'].kind, 'workflow');
  assert.equal(models['ai-finance-workflow'].bars, undefined);
  assert.ok(models['ai-finance-workflow'].note.includes('No live AI'));
});
test('hire compares incremental monthly sales with the contribution-based break-even threshold', () => {
  const m = models['plan-hire-expansion'];
  assert.deepEqual(m.bars.map(row => row.value), [60000, 20000]);
  assert.equal(m.reference, 30000 / .5); assert.ok(m.max > m.reference);
});
test('profit-to-cash waterfall maintains running start and end balances including negative cash', () => {
  const m = models['understand-cash-profit'];
  assert.deepEqual(m.bars.map(row => row.start), [0, 30000, -10000, 5000, 0]);
  assert.deepEqual(m.bars.map(row => row.value), [30000, -40000, 15000, -20000, -15000]);
  assert.equal(m.bars.slice(0, 4).reduce((sum, row) => sum + row.value, 0), m.bars[4].value);
});
test('marketing uses a shared zero baseline and preserves Social’s negative contribution', () => {
  const m = models['assess-marketing'];
  assert.deepEqual(m.bars.map(row => row.value), [6000, -800]);
  assert.ok(m.min < -800 && m.max >= 6000);
});
test('reporting separates currency and percentage measures without misleading scales', () => {
  const m = models['useful-reporting'];
  assert.deepEqual(m.tiles.map(tile => [tile.previous, tile.current]), [[100000, 120000], [40, 35], [10000, 25000]]);
  assert.equal((m.tiles[0].current - m.tiles[0].previous) / m.tiles[0].previous * 100, 20);
  assert.equal(m.tiles[1].current - m.tiles[1].previous, -5);
  assert.equal(m.tiles[1].max, 100);
  for (const tile of m.tiles) assert.ok(tile.max >= Math.max(tile.previous, tile.current));
});
