import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { showPrices } from '../src/lib/publication.mjs';
import { formatPrice, prices } from '../src/lib/pricing.mjs';

test('approved Review and Monthly prices are the published fees', () => {
  assert.equal(showPrices, true);
  assert.equal(formatPrice('INR', prices.INR.review), '₹35,000');
  assert.equal(formatPrice('INR', prices.INR.monthly), '₹25,000');
  assert.equal(formatPrice('AED', prices.AED.review), 'AED 7,500');
  assert.equal(formatPrice('AED', prices.AED.monthly), 'AED 4,500');
  assert.equal(formatPrice('GBP', prices.GBP.review), '£2,500');
  assert.equal(formatPrice('GBP', prices.GBP.monthly), '£1,500');
  assert.equal(prices.INR.review, 35000);
  assert.doesNotMatch(JSON.stringify(prices), /2000|95|219/);
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
