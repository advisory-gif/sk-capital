import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const css = postcss.parse(await readFile('src/index.css', 'utf8'));
const declarations = selector => {
  const result = {};
  css.walkRules(rule => { if (rule.selector === selector) rule.walkDecls(decl => { result[decl.prop] = decl.value; }); });
  return result;
};
const tokens = declarations('.sample-page, .sample-visual');

test('example bodies and chart labels share a readable type scale', () => {
  assert.equal(tokens['--sample-body'], '1rem');
  assert.equal(tokens['--sample-small'], '.875rem');
  assert.equal(tokens['--sample-value'], '1.125rem');
  assert.equal(tokens['--sample-leading'], '1.625');
  for (const selector of ['.sample-story-point p', '.sample-service-scope p, .sample-service-scope li', '.chart-note', '.workflow-step p']) {
    assert.equal(declarations(selector)['font-size'], 'var(--sample-body)', selector);
    assert.equal(declarations(selector)['line-height'], 'var(--sample-leading)', selector);
  }
  const label = declarations('.sample-story-point h2');
  assert.equal(label['font-size'], 'var(--sample-body)');
  assert.equal(label['text-transform'], undefined);
});

test('chart figures share Inter while display headings retain Newsreader', () => {
  const values = declarations('.stack-labels strong, .visual-bar-label strong, .dashboard-period strong, .cash-shortfall strong, .reporting-change');
  assert.equal(values['font-family'], "'Inter', Arial, sans-serif");
  assert.equal(values['font-size'], 'var(--sample-value)');
  assert.equal(values['font-variant-numeric'], 'tabular-nums');
  assert.ok(declarations('.visual-title')['font-family'].includes('Newsreader'));
  assert.equal(declarations('.stack-labels strong')['font-family'], undefined);
});

const luminance = hex => {
  const rgb = [1, 3, 5].map(start => Number.parseInt(hex.slice(start, start + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb.reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
};
const contrast = (a, b) => { const pair = [luminance(a), luminance(b)].sort((x, y) => x - y); return (pair[1] + .05) / (pair[0] + .05); };

test('chart and text colours preserve contrast and consistent negative meaning', () => {
  for (const token of ['--chart-positive', '--chart-negative', '--chart-neutral']) assert.ok(contrast(tokens[token], '#e6ece2') >= 3, token);
  assert.ok(contrast(tokens['--chart-neutral'], '#96f878') >= 3);
  assert.ok(contrast('#435448', '#f7f8f3') >= 4.5);
  assert.ok(contrast('#212427', '#ffffff') >= 4.5);
  assert.ok(contrast('#0C2B15', '#96f878') >= 4.5);
  assert.equal(declarations('.visual-bar-negative').background, 'var(--chart-negative)');
  assert.equal(declarations('.cash-legend .cash-delayed-key')['border-top'], '3px dashed var(--chart-negative)');
});

test('narrow gallery previews reflow amounts and workflow without wide fixed tracks', () => {
  const atWidth = width => {
    const found = {};
    css.walkAtRules('media', rule => {
      if (rule.params !== `(max-width: ${width}px)`) return;
      rule.walkRules(child => {
        found[child.selector] ??= {};
        child.walkDecls(decl => { found[child.selector][decl.prop] = decl.value; });
      });
    });
    return found;
  };
  const narrow = atWidth(420), tiny = atWidth(360);
  assert.equal(narrow['.preview-hire']['grid-template-columns'], 'minmax(0, 1fr)');
  assert.equal(narrow['.preview-reporting > div > p']['flex-wrap'], 'wrap');
  assert.equal(narrow['.preview-reporting strong']['font-size'], '1rem');
  assert.equal(tiny['.preview-workflow .workflow-track']['grid-template-columns'], 'minmax(0, 1fr)');
  assert.equal(tiny['.preview-workflow .workflow-arrow'].transform, 'none');
});
