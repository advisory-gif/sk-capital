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
  assert.match(html, /Clearfig \| See your business in your own data/);
  assert.match(html, /360-degree|revenue, costs, clients, operations, capacity, marketing and cash/);
  assert.doesNotMatch(html, /CFO|FP&A|earn more and spend less/);
  assert.match(html, /https:\/\/clearfig\.in\//);
  assert.match(html, /favicon\.svg/);
  assert.doesNotMatch(html, /SK Capital|skcapital\.co\.in/);
  assert.doesNotMatch(html, /—/);
});

test('ripe fig logo uses fig, leaf, ink and paper', async () => {
  const logo = await readFile('public/logo.svg', 'utf8');
  const favicon = await readFile('public/favicon.svg', 'utf8');
  for (const colour of ['#5C2A38', '#4E6B3A', '#1C1714', '#F6F3EE']) assert.match(logo, new RegExp(colour));
  assert.doesNotMatch(logo, /<text[\s>]/);
  assert.match(favicon, /#5C2A38/);
  assert.match(favicon, /#A9BF8F/);
  assert.match(await readFile('src/components/Logo.tsx', 'utf8'), /src="\/logo\.svg"/);
});

test('README keeps the former name and photo credits', async () => {
  const readme = await readFile('README.md', 'utf8');
  assert.match(readme, /formerly SK Capital/);
  assert.match(readme, /Scott Graham/);
  assert.match(readme, /Carlos Muza/);
  assert.match(readme, /unsplash\.com\/license/);
  assert.match(readme, /showPrices/);
});
