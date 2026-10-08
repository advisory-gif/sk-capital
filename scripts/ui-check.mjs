import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
const bundled = await build({ entryPoints: ['src/main.tsx'], bundle: true, write: false, format: 'iife', jsx: 'automatic', platform: 'browser', loader: { '.css': 'empty' } });
const script = bundled.outputFiles[0].text;
async function load({ country = 'US', stored, url = 'https://example.test/', slow = false, failed = false } = {}) {
  const errors = []; const scrollTargets = []; const console = new VirtualConsole(); console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console, beforeParse(window) {
    window.scrollTo = () => {}; window.HTMLElement.prototype.scrollIntoView = function () { scrollTargets.push(this.id); };
    if (stored) window.localStorage.setItem('skcapital.currency', stored);
    window.fetch = async (_url, options) => { if (slow) await delay(100); if (options.signal.aborted || failed) throw Error('Unavailable'); return { ok: true, json: async () => ({ country }) }; };
  }});
  dom.window.eval(script);
  await delay(slow ? 25 : 100);
  return { dom, window: dom.window, document: dom.window.document, errors, scrollTargets };
}
for (const [country, expected, prices] of [['IN','INR',['₹2,000','₹3,500','₹5,000']],['US','USD',['US$25','US$45','US$59']],['AE','AED',['AED 95','AED 165','AED 219']],['GB','USD',['US$25']]]) {
  const { dom, document, errors } = await load({ country });
  assert.equal(document.querySelector('#currency').value, expected);
  for (const price of prices) assert.ok(document.body.textContent.includes(price));
  assert.equal(document.querySelectorAll('article').length, 3); assert.equal(document.querySelectorAll('form').length, 0); assert.equal(document.querySelectorAll('h1').length, 1); assert.deepEqual(errors, []); dom.window.close();
  console.log(`PASS ${country}: ${expected}, exact product prices, three finance cards, no fake form, no runtime errors`);
}
const saved = await load({ country:'US',stored:'AED' }); assert.equal(saved.document.querySelector('#currency').value,'AED'); saved.window.close(); console.log('PASS saved manual override wins over country');
const fallback = await load({ failed:true }); assert.equal(fallback.document.querySelector('#currency').value,'USD'); fallback.window.close(); console.log('PASS offline/static preview fallback is USD');
const late = await load({ country:'IN',slow:true }); const select = late.document.querySelector('#currency'); select.value='AED'; select.dispatchEvent(new late.window.Event('change',{bubbles:true})); await delay(200); assert.equal(select.value,'AED'); assert.equal(late.window.localStorage.getItem('skcapital.currency'),'AED'); late.window.close(); console.log('PASS manual choice survives late response and persists');
const legacy = await load({ url:'https://example.test/#/pricing' }); assert.equal(legacy.window.location.hash,'#services'); legacy.window.close(); console.log('PASS old hash pricing link routes to current services');
const oldAnchor = await load({ url:'https://example.test/#reviews' }); assert.ok(oldAnchor.scrollTargets.includes('services')); oldAnchor.window.close(); console.log('PASS legacy reviews anchor scrolls to services');
const ui = await load();
const custom = ui.document.querySelector('#custom-projects');
assert.equal(custom.querySelectorAll('li').length, 4);
assert.ok(custom.textContent.includes('fees are agreed after a conversation'));
assert.ok(!/US\$|₹|AED \d/.test(custom.textContent));
assert.ok(!/accounting|bookkeeping/i.test(ui.document.body.textContent));
assert.ok([...ui.document.querySelectorAll('nav a')].some(a => a.textContent === 'Services' && a.hash === '#services'));
assert.ok(![...ui.document.querySelectorAll('nav a')].some(a => a.textContent === 'Reviews'));
assert.equal(custom.querySelector('a').href, 'https://cal.com/skcapital/free-financial-breakdown');
assert.ok(custom.querySelector('a[href^="mailto:advisory@skcapital.co.in"]'));
console.log('PASS four unpriced custom capabilities, Services navigation, positive scope copy, custom booking/email');
const toggle = ui.document.querySelector('button[aria-controls="mobile-menu"]');
for (let i=0;i<2;i++) { toggle.click(); await delay(10); assert.ok(ui.document.querySelector('#mobile-menu')); toggle.click(); await delay(10); assert.equal(ui.document.querySelector('#mobile-menu'),null); }
toggle.click(); await delay(10); ui.document.querySelector('#mobile-menu a').click(); await delay(20); assert.equal(ui.document.querySelector('#mobile-menu'),null); assert.equal(ui.window.location.hash,'#services');
const bookingLinks=[...ui.document.querySelectorAll('a')].filter(a=>a.textContent.includes('Book a free intro')); assert.ok(bookingLinks.length); assert.ok(bookingLinks.every(a=>a.href==='https://cal.com/skcapital/free-financial-breakdown'));
assert.ok(ui.document.querySelector('a[href^="mailto:advisory@skcapital.co.in"]')); assert.deepEqual(ui.errors,[]); ui.window.close(); console.log('PASS repeated mobile toggles, close on navigation, booking and email destinations');
console.log('DOM checks do not verify visual layout or hosting geolocation headers.');
