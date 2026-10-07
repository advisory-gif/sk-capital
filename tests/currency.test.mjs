import test from 'node:test';
import assert from 'node:assert/strict';
import { currencyForCountry, savedCurrency, saveCurrency, detectCurrency, currencyKey } from '../src/lib/currency.mjs';
import handler from '../api/country.js';
test('country mapping: India, US, UAE and safe defaults', () => {
  for (const [country, expected] of [['IN','INR'],['US','USD'],['AE','AED'],['ae','AED'],['GB','USD'],[null,'USD'],[undefined,'USD'],['invalid','USD']]) assert.equal(currencyForCountry(country), expected);
});
test('manual choice persists; invalid values are ignored', () => {
  const data = new Map(); const store = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  saveCurrency(store,'AED'); assert.equal(savedCurrency(store),'AED'); saveCurrency(store,'EUR'); assert.equal(savedCurrency(store),'AED'); data.set(currencyKey,'invalid'); assert.equal(savedCurrency(store),null);
});
test('blocked storage is safe', () => {
  const store = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(savedCurrency(store),null); assert.doesNotThrow(() => saveCurrency(store,'INR'));
});
test('same-origin detection; network, HTTP, malformed and missing country fallbacks', async () => {
  assert.equal(await detectCurrency(async (url, options) => { assert.equal(url,'/api/country'); assert.equal(options.cache,'no-store'); return { ok:true,json:async()=>({country:'IN'}) }; }), 'INR');
  for (const fetcher of [async()=>{throw Error('offline');},async()=>({ok:false}),async()=>({ok:true,json:async()=>{throw Error('HTML');}}),async()=>({ok:true,json:async()=>null})]) assert.equal(await detectCurrency(fetcher),'USD');
});
test('endpoint returns only country; prevents cross-visitor caching', () => {
  for (const [raw, expected] of [['IN','IN'],['ae','AE'],[undefined,null],[['US','IN'],null],['bad',null]]) {
    const headers={}; const response={setHeader:(key,value)=>headers[key]=value,status(code){assert.equal(code,200);return this;},json(data){assert.deepEqual(data,{country:expected});}};
    handler({headers:{'x-vercel-ip-country':raw,'x-real-ip':'not-returned'}},response);
    assert.match(headers['Cache-Control'],/no-store/); assert.equal(headers['Vercel-CDN-Cache-Control'],'no-store');
  }
});
