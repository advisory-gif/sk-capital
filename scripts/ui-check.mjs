import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
const bundled = await build({ entryPoints: ['src/main.tsx'], bundle: true, write: false, format: 'iife', jsx: 'automatic', platform: 'browser', loader: { '.css': 'empty' }, define: { 'import.meta.env.MODE': '"test"' } });
const script = bundled.outputFiles[0].text;
async function load({ country = 'US', stored, url = 'https://example.test/', slow = false, failed = false, motion = 'unavailable' } = {}) {
  const observers = []; const mediaListeners = new Set(); const media = { matches: motion === 'reduced', addEventListener: (_, listener) => mediaListeners.add(listener), removeEventListener: (_, listener) => mediaListeners.delete(listener) };
  const errors = []; const scrollTargets = []; const console = new VirtualConsole(); console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console, beforeParse(window) {
    if (motion !== 'unavailable') {
      window.matchMedia = () => media;
      window.IntersectionObserver = class {
        constructor(callback) { this.callback = callback; this.observed = new Set(); observers.push(this); }
        observe(element) { this.observed.add(element); }
        unobserve(element) { this.observed.delete(element); }
        disconnect() { this.observed.clear(); }
      };
    }
    window.scrollTo = () => {}; window.HTMLElement.prototype.scrollIntoView = function () { scrollTargets.push(this.id); };
    if (stored) window.localStorage.setItem('clearfig.currency', stored);
    window.fetch = async (_url, options) => { if (slow) await delay(100); if (options.signal.aborted || failed) throw Error('Unavailable'); return { ok: true, json: async () => ({ country }) }; };
  }});
  dom.window.eval(script);
  await delay(slow ? 25 : 100);
  if (!slow) for (let attempt = 0; attempt < 100; attempt++) {
    if (dom.window.document.querySelector('h1')) break;
    await delay(20);
  }
  return { dom, window: dom.window, document: dom.window.document, errors, scrollTargets, observers, media, mediaListeners };
}
const marketPrices = {
  IN: { value: 'INR', review: '₹35,000', monthly: '₹25,000', founding: true },
  US: { value: 'INR', review: '₹35,000', monthly: '₹25,000', founding: true },
  AE: { value: 'AED', review: 'AED 7,500', monthly: 'AED 4,500', founding: false },
  GB: { value: 'GBP', review: '£2,500', monthly: '£1,500', founding: false },
};
for (const country of ['IN', 'US', 'AE', 'GB']) {
  const { document, errors, window } = await load({ country });
  const expected = marketPrices[country];
  const select = document.querySelector('#currency');
  assert.equal(select.value, expected.value);
  assert.deepEqual([...select.options].map(option => option.textContent), ['India', 'UAE', 'UK']);
  const pricing = document.querySelector('#pricing');
  assert.ok(pricing.textContent.includes('Free self-check'));
  assert.ok(pricing.textContent.includes('Clearfig Review'));
  assert.ok(pricing.textContent.includes('Clearfig Monthly'));
  assert.ok(pricing.textContent.includes(expected.review));
  assert.ok(pricing.textContent.includes(expected.monthly));
  assert.ok(pricing.textContent.includes('2 to 3 weeks'));
  assert.ok(pricing.textContent.includes('50% upfront and 50% on delivery'));
  assert.ok(pricing.textContent.includes('credited against the first month of Monthly'));
  assert.ok(pricing.textContent.includes('3-month minimum'));
  assert.ok(pricing.textContent.includes("30 days' notice"));
  assert.ok(pricing.textContent.includes('quoted separately after a Review'));
  assert.ok(pricing.textContent.includes('not a bookkeeping, tax or CFO service'));
  assert.equal(pricing.textContent.includes('Founding-client pricing is available for the first 3 clients'), expected.founding);
  for (const price of ['₹2,000', '₹3,500', '₹5,000', 'US$25', 'US$45', 'US$59', 'AED 95', 'AED 165', 'AED 219', '3,999', 'One-time fixed-scope fee', 'Loading price']) assert.equal(document.body.textContent.includes(price), false, price);
  assert.equal(document.querySelectorAll('form').length, 0);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.ok(!document.body.textContent.includes('—'));
  assert.deepEqual(errors, []);
  window.close();
  console.log(`PASS ${country}: published ${expected.review} Review and ${expected.monthly} Monthly, no old fees`);
}
const legacy = await load({ url:'https://example.test/#/pricing' }); assert.equal(legacy.window.location.hash,'#pricing'); legacy.window.close(); console.log('PASS old hash pricing link routes to pricing');
const oldAnchor = await load({ url:'https://example.test/#reviews' }); assert.ok(oldAnchor.scrollTargets.includes('review')); oldAnchor.window.close(); console.log('PASS legacy reviews anchor scrolls to the review');
const ui = await load();
assert.equal(ui.document.title, 'Clearfig | Clarity from your own data');
assert.equal(ui.document.querySelector('h1').textContent, 'Earn more and spend less, from the numbers you already have.');
assert.ok(ui.document.body.textContent.includes('Clarity from your own data'));
assert.ok(ui.document.body.textContent.includes('Your numbers already hold the answers'));
assert.equal(ui.document.querySelectorAll('#questions h3').length, 5);
assert.ok(ui.document.querySelector('#questions').textContent.includes('Sales are growing. Why isn\'t profit?'));
assert.ok(ui.document.querySelector('#questions').textContent.includes('Which clients, projects or products are worth growing?'));
assert.deepEqual([...ui.document.querySelectorAll('#process h3')].map(heading => heading.textContent), ['Understand', 'Decide', 'Implement', 'Review']);
assert.ok(ui.document.querySelector('#process').textContent.includes('separate scope'));
assert.ok(ui.document.querySelector('#review').textContent.includes('scoped before it starts'));
assert.ok(ui.document.querySelector('#review').textContent.includes('published price'));
assert.ok(ui.document.querySelector('#pricing').textContent.includes('₹35,000'));
assert.equal(ui.document.querySelector('#currency').value, 'INR');
assert.ok(ui.document.querySelector('#who').textContent.includes('10 to 50'));
assert.ok(ui.document.querySelector('#accountant').textContent.includes('does not provide bookkeeping, tax, audit'));
assert.ok(ui.document.querySelector('#about').textContent.includes('Snesh Kakkar'));
assert.ok(ui.document.querySelector('#about').textContent.includes('American Express and Amazon'));
assert.ok(ui.document.querySelector('#about').textContent.includes('Megha Dalmia'));
assert.ok(ui.document.querySelector('#about').textContent.includes('ITC Infotech and Sun Pharma'));
assert.ok(ui.document.querySelector('#about').textContent.includes('We started Clearfig because the owners who need this clarity most rarely get it.'));
assert.ok(!ui.document.querySelector('#about').textContent.includes('TBC'));
assert.ok(!ui.document.body.textContent.includes('Short biographies are not published yet'));
assert.equal(ui.document.querySelectorAll('#faq details').length, 8);
assert.ok(ui.document.querySelector('#contact h2').textContent.includes('numbers you already have'));
assert.deepEqual([...ui.document.querySelectorAll('main > section[id]')].map(section => section.id), ['who', 'questions', 'process', 'review', 'pricing', 'accountant', 'examples', 'trust', 'faq', 'about', 'contact']);
assert.ok(!/FP&A|BP&A|guaranteed|testimonial|bank-grade|AI-proof|SK Capital/i.test(ui.document.body.textContent));
assert.ok(!ui.document.body.textContent.includes('—'));
assert.ok(!ui.document.body.textContent.includes('one approved spreadsheet input to one draft commentary workflow'));
assert.equal(ui.document.querySelectorAll('a[download]').length, 0);
const heroCta = ui.document.querySelector('.hero-layout .button-primary');
assert.equal(heroCta.href, 'https://cal.com/skcapital/free-financial-breakdown');
assert.equal(heroCta.target, '_blank');
assert.equal(ui.document.querySelectorAll('.hero-layout .button-primary, .hero-layout a.example-link').length, 1);
const sample = ui.document.querySelector('#sample-output');
assert.ok(sample.textContent.includes('Fictional example · Margin Check · USD'));
assert.equal(sample.querySelectorAll('.sample-visual').length, 1);
assert.deepEqual([...sample.querySelectorAll('.contribution-stack [data-value]')].map(node => Number(node.dataset.value)), [38000, 12000]);
assert.ok(sample.textContent.includes('See what three projects leave.'));
assert.ok(sample.textContent.includes('$12,000'));
assert.ok(sample.textContent.includes('not service prices or a client result'));
assert.ok(heroCta.compareDocumentPosition(sample) & ui.window.Node.DOCUMENT_POSITION_FOLLOWING);
assert.ok(sample.compareDocumentPosition(ui.document.querySelector('#contact')) & ui.window.Node.DOCUMENT_POSITION_FOLLOWING);
assert.equal(ui.document.querySelectorAll('#examples a[aria-label^="See an example"]').length, 8);
const priceSelect = ui.document.querySelector('#currency');
priceSelect.value = 'GBP';
priceSelect.dispatchEvent(new ui.window.Event('change', { bubbles: true }));
await delay(20);
assert.equal(priceSelect.value, 'GBP');
assert.ok(ui.document.querySelector('#pricing').textContent.includes('£2,500'));
assert.ok(ui.document.querySelector('#pricing').textContent.includes('£1,500'));
assert.equal(ui.document.querySelector('#pricing').textContent.includes('Founding-client pricing'), false);
assert.equal(ui.window.localStorage.getItem('clearfig.currency'), 'GBP');
console.log('PASS Clearfig promise, owner questions, fictional Margin Check, published prices');
assert.ok([...ui.document.querySelectorAll('nav a')].some(a => a.textContent === 'How it works' && a.hash === '#process'));
assert.ok([...ui.document.querySelectorAll('nav a')].some(a => a.textContent === 'Pricing' && a.hash === '#pricing'));
assert.ok(![...ui.document.querySelectorAll('nav a')].some(a => a.textContent === 'Reviews' || a.textContent === 'Services'));
assert.ok(ui.document.querySelector('a[href^="mailto:snesh@clearfig.in"]'));
assert.equal(ui.document.querySelector('img[alt="Clearfig"]')?.getAttribute('src'), '/logo.svg');
const toggle = ui.document.querySelector('button[aria-controls="mobile-menu"]');
for (let i=0;i<2;i++) { toggle.click(); await delay(10); assert.ok(ui.document.querySelector('#mobile-menu')); toggle.click(); await delay(10); assert.equal(ui.document.querySelector('#mobile-menu'),null); }
toggle.click(); await delay(10); ui.document.querySelector('#mobile-menu a').click(); await delay(20); assert.equal(ui.document.querySelector('#mobile-menu'),null); assert.equal(ui.window.location.hash,'#who');
const processLink = [...ui.document.querySelectorAll('nav a')].find(link => link.textContent === 'How it works');
const beforeRepeatedAnchor = ui.scrollTargets.filter(id => id === 'process').length;
processLink.click(); await delay(20); processLink.click(); await delay(20);
assert.equal(ui.scrollTargets.filter(id => id === 'process').length, beforeRepeatedAnchor + 2);
for (const escapeFromChild of [false, true]) {
  toggle.click(); await delay(10);
  const focused = escapeFromChild ? ui.document.querySelector('#mobile-menu a') : toggle;
  focused.focus(); focused.dispatchEvent(new ui.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await delay(10);
  assert.equal(ui.document.querySelector('#mobile-menu'), null);
  assert.equal(ui.document.activeElement, toggle);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
}
console.log('PASS repeated same-anchor navigation and mobile Escape from toggle/link with restored focus');
const bookingLinks=[...ui.document.querySelectorAll('a')].filter(a=>a.textContent.includes('Book a free conversation')); assert.ok(bookingLinks.length >= 3); assert.ok(bookingLinks.every(a=>a.href==='https://cal.com/skcapital/free-financial-breakdown'));
assert.ok(ui.document.querySelector('a[href^="mailto:snesh@clearfig.in"]')); assert.deepEqual(ui.errors,[]); ui.window.close(); console.log('PASS repeated mobile toggles, close on navigation, booking and email destinations');
console.log('DOM checks do not verify visual layout or hosting geolocation headers.');

const noObserver = await load();
assert.equal(noObserver.document.querySelectorAll('[data-reveal]').length, 10);
assert.equal(noObserver.document.querySelectorAll('.is-revealed').length, 0);
const photo = noObserver.document.querySelector('.hero-visual img');
const charts = noObserver.document.querySelector('#review img');
assert.equal(noObserver.document.querySelectorAll('img').length, 4);
assert.equal(noObserver.document.querySelectorAll('img[alt="Clearfig"]').length, 2);
assert.equal(photo.width, 1440); assert.equal(photo.height, 960);
assert.ok(photo.alt.includes('Illustrative')); assert.ok(photo.srcset.includes('640w'));
assert.equal(photo.getAttribute('fetchpriority'), 'high');
assert.equal(charts.getAttribute('loading'), 'lazy');
assert.ok(charts.alt.includes('Illustrative'));
assert.ok(noObserver.document.body.textContent.includes('Scott Graham'));
assert.ok(noObserver.document.body.textContent.includes('Carlos Muza'));
noObserver.window.close();
const reduced = await load({ motion: 'reduced' });
assert.equal(reduced.observers.length, 0); assert.equal(reduced.document.querySelectorAll('.is-revealed').length, 0); reduced.window.close();
const reveal = await load({ motion: 'enabled' });
const observer = reveal.observers.find(item => item.observed.size);
assert.equal(observer.observed.size, 10);
const section = reveal.document.querySelector('#about');
observer.callback([{target: section, isIntersecting: false}]); assert.ok(!section.classList.contains('is-revealed'));
observer.callback([{target: section, isIntersecting: true}]); assert.ok(section.classList.contains('is-revealed')); assert.ok(!observer.observed.has(section));
reveal.media.matches = true; reveal.mediaListeners.forEach(listener => listener());
assert.equal(observer.observed.size, 0); assert.equal(reveal.document.querySelectorAll('.is-revealed').length, 0);
assert.deepEqual(reveal.errors, []); reveal.window.close();
console.log('PASS one reserved-space responsive illustrative image, observer fallback, one-time reveal, reduced motion at load and when changed');

// Exercise every service's own link and the complete example route lifecycle.
const { readFile } = await import('node:fs/promises');
const exampleData = JSON.parse(await readFile('src/data/service-samples.json', 'utf8'));
const examples = await load({ stored: 'AED' });
const serviceLinks = [...examples.document.querySelectorAll('#examples a[aria-label^="See an example"]')];
assert.equal(serviceLinks.length, 8);
assert.deepEqual(serviceLinks.map(link => link.pathname.split('/').pop()), exampleData.map(item => item.id));
assert.equal(examples.document.querySelector('#currency').value, 'AED');
assert.ok(examples.document.body.textContent.includes('AED 7,500'));
for (const item of exampleData) {
  const link = examples.document.querySelector(`a[href="/samples/${item.id}"]`);
  link.click(); await delay(120);
  assert.equal(examples.window.location.pathname, `/samples/${item.id}`);
  assert.equal(examples.document.title, `${item.name} example | Clearfig`);
  assert.equal(examples.document.querySelectorAll('h1').length, 1);
  assert.equal(examples.document.querySelector('h1').textContent, item.question);
  assert.equal(examples.document.activeElement.tagName, 'H1');
  assert.ok(examples.document.body.textContent.includes('All examples use fictional US dollars (USD)'));
  assert.ok(!/₹|\bINR\b|Nothing is submitted|A little more explanation|Contribution left|Contribution margin/.test(examples.document.body.textContent));
  assert.equal(examples.document.querySelector('#explanations-heading').textContent, 'Common questions');
  const allDetails = examples.document.querySelector('#sample-details');
  assert.equal(allDetails.open, false);
  assert.ok(allDetails.contains(examples.document.querySelector('table')));
  assert.ok(allDetails.contains(examples.document.querySelector('#explanations-heading')));
  assert.equal(examples.document.querySelectorAll('.sample-overview .sample-visual').length, 1);
  assert.deepEqual([...examples.document.querySelectorAll('.sample-story h2')].map(node => node.textContent), ['What happened', 'Why it matters', 'What to check']);
  assert.deepEqual([...examples.document.querySelectorAll('.sample-story p')].map(node => node.textContent), [item.finding, item.meaning, item.nextStep]);
  assert.ok(!examples.document.querySelector('.sample-overview').textContent.includes('undefined'));
  assert.ok(allDetails.contains(examples.document.querySelector('.sample-story')));
  assert.equal(examples.document.querySelectorAll('.sample-overview .sample-story').length, 0);
  assert.equal(examples.document.querySelector('.sample-takeaway').textContent, `The next step${item.takeaway}`);
  assert.ok(examples.document.querySelector('.sample-visual').compareDocumentPosition(examples.document.querySelector('.sample-takeaway')) & examples.window.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.equal(examples.document.querySelectorAll('.sample-overview table, .sample-overview details').length, 0);
  assert.equal(examples.document.querySelectorAll('.sample-details-body .text-sm').length, 0);
  assert.ok(examples.document.querySelector('.sample-service-scope'));
  if (item.id === 'plan-vs-actual') assert.equal(examples.document.querySelectorAll('.visual-bar-negative').length, 3);
  if (item.id === 'plan-hire-expansion') assert.ok(examples.document.querySelector('.visual-bars').getAttribute('aria-label').includes('$60,000 extra monthly sales'));
  allDetails.querySelector('summary').click(); assert.equal(allDetails.open, true);
  allDetails.querySelector('summary').click(); assert.equal(allDetails.open, false);

  assert.equal(examples.document.querySelectorAll('#explanations-heading + p + details, #explanations-heading ~ details').length, 3);
  assert.equal(examples.document.querySelectorAll('table').length, 2);
  for (const detail of examples.document.querySelectorAll('details')) {
    detail.querySelector('summary').click(); assert.equal(detail.open, true);
    detail.querySelector('summary').click(); assert.equal(detail.open, false);
  }
  for (const table of examples.document.querySelectorAll('table')) {
    assert.ok(table.querySelector('caption'));
    assert.ok(table.querySelector('th[scope="col"]'));
    assert.equal(table.querySelectorAll('th[scope="row"]').length, table.querySelectorAll('tbody tr').length);
  }
  const ids = [...examples.document.querySelectorAll('[id]')].map(node => node.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.equal(examples.document.querySelectorAll('form,input,textarea,iframe').length, 0);
  [...examples.document.querySelectorAll('a')].find(a => a.textContent === 'Back to examples').click(); await delay(150);
  assert.equal(examples.window.location.pathname, '/');
  assert.equal(examples.document.activeElement.id, 'examples');
  assert.equal(examples.document.querySelector('#currency').value, 'AED');
  assert.ok(examples.document.querySelector('#pricing').textContent.includes('AED 7,500'));
  assert.equal(examples.document.querySelector('#pricing').textContent.includes('₹35,000'), false);
}
assert.deepEqual(examples.errors, []); examples.window.close();
for (const item of exampleData) {
  const direct = await load({ url: `https://example.test/samples/${item.id}` });
  assert.equal(direct.document.querySelector('h1').textContent, item.question);
  assert.equal(direct.document.querySelectorAll('#currency').length, 0);
  assert.deepEqual(direct.errors, []); direct.window.close();
}
const list = await load({ url:'https://example.test/samples' });
assert.equal(list.document.querySelectorAll('main article').length, 8);
assert.equal(list.document.querySelectorAll('.sample-preview').length, 8);
const galleryIds = [...list.document.querySelectorAll('[id]')].map(node => node.id);
assert.equal(galleryIds.length, new Set(galleryIds).size);
assert.ok(!list.document.body.textContent.includes('undefined'));
list.document.querySelector('main article a').click(); await delay(40);
list.window.history.back(); await delay(40);
assert.equal(list.window.location.pathname, '/samples');
list.window.history.forward(); await delay(40);
assert.equal(list.window.location.pathname, '/samples/margin-check');
list.document.querySelector('.skip-link').click(); assert.equal(list.document.activeElement.id, 'main-content');
assert.deepEqual(list.errors, []); list.window.close();
const missing = await load({ url:'https://example.test/samples/not-a-service' });
assert.ok(missing.document.querySelector('h1').textContent.includes('right example'));
assert.ok(missing.document.querySelector('main a[href="/samples"]'));
missing.window.close();
console.log('PASS all eight example links, direct routes, 24 explanations, repeated disclosures, accessible tables, focus, back/forward, missing route, fixed USD examples and market prices');
