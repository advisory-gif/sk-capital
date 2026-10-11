import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { showPrices } from '../src/lib/publication.mjs';

test('fees stay unpublished until founders approve a price', () => {
  assert.equal(showPrices, false);
});

test('public metadata is Clearfig, not SK Capital', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.match(html, /Clearfig \| Clarity from your own data/);
  assert.match(html, /https:\/\/clearfig\.in\//);
  assert.match(html, /favicon\.svg/);
  assert.doesNotMatch(html, /SK Capital|skcapital\.co\.in/);
  assert.doesNotMatch(html, /—/);
});

test('README keeps the former name and photo credits', async () => {
  const readme = await readFile('README.md', 'utf8');
  assert.match(readme, /formerly SK Capital/);
  assert.match(readme, /Scott Graham/);
  assert.match(readme, /Carlos Muza/);
  assert.match(readme, /unsplash\.com\/license/);
  assert.match(readme, /showPrices/);
});
