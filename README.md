# Clearfig website

The public site for Clearfig, formerly SK Capital. Clearfig is a data company. It helps owners see their business clearly through their own data: a 360-degree health check across revenue, costs, clients, operations, capacity, marketing and cash. Finance is one lens among several. The intended domain is [clearfig.in](https://clearfig.in). This repository used to be published as SK Capital at skcapital.co.in. Do not deploy, publish, change DNS, or change Vercel settings from this codebase until the founders ask.

Spreadsheets and AI can support the work. They are not the promise. The promise is a clear view of the business from the owner's own data, and a decision they can carry out.

## Run and check

Use Node.js 22 or newer.

```
npm ci
npm run lint
npm test
npm run test:ui
npm run build
python3 scripts/verify-samples.py
python3 scripts/check-sample-numbers.py
npm run dev -- --host 127.0.0.1
```

`npm test` covers country mapping, fee publication staying off, Clearfig metadata, sample data, chart geometry and contrast. `npm run test:ui` bundles the React app and checks copy, navigation, the unpublished price flag, fictional examples and keyboard behaviour. It is not visual layout QA.

## What the site says

Edit `src/lib/advisory.ts` for the promise, audience, questions, steps, deliverables, trust notes, FAQs and founder biographies.

The first public offer is a focused business review. Scope, inputs, deliverable, timing and fee are agreed before paid work starts. The booking link is still `https://cal.com/skcapital/free-financial-breakdown` until the founders replace it. The contact email is `snesh@clearfig.in`.

The founders have approved public prices for three steps: a free self-check, the Clearfig Review, and Clearfig Monthly. India is ₹35,000 for the Review and ₹25,000 per month, with founding-client pricing available for the first 3 clients. The UAE is AED 7,500 and AED 4,500 per month. The UK is £2,500 and £1,500 per month. The selector defaults to India. `src/lib/publication.mjs` exports `showPrices` as `true`. The older starter amounts in `src/lib/offers.ts` are not these fees and are not rendered.

Examples under `/samples` use the existing fictional US dollar data. They are labelled as examples, not client results. `src/data/service-samples.json` is unchanged.

The site does not claim bookkeeping, tax, audit, regulated accounting, client results, testimonials, or a security certification.

## Photographs

Calm desk photographs, used as illustration. They are not Clearfig clients, offices or reports. Both are free to use under the [Unsplash License](https://unsplash.com/license), including commercial use. Attribution is not required by that licence. Credits are on the page and here.

| File | Subject | Photographer | Source |
|---|---|---|---|
| `public/images/reviewing-numbers-640.webp`, `960`, `1440` | Person reviewing notes beside a laptop | Scott Graham | [Unsplash](https://unsplash.com/photos/person-holding-pencil-near-laptop-computer-5fNmWej4tAA) |
| `public/images/charts-desk-800.webp`, `1200` | Laptop with charts and a notebook | Carlos Muza | [Unsplash](https://unsplash.com/photos/laptop-computer-on-glass-top-table-hpjSkU2UYSU) |

The hero image is eager-loaded. The second image is lazy-loaded. Both are WebP, with width and height set so the layout does not jump. Alt text describes the photo and says it is illustrative.

## Visual system

Warm paper (`#F6F3EE`), ink (`#1C1714`), fig (`#5C2A38`) and leaf (`#4E6B3A`). Fraunces for headings, Figtree for text, with Georgia and system-ui as fallbacks. The wordmark is the ripe-fig logo: a fig in fig, a leaf in leaf, “Clear” in ink and “fig” in fig (`public/logo.svg`, `public/favicon.svg`, `src/components/Logo.tsx`). Reversed and single-colour files are `public/logo-reversed.svg` and `public/logo-mono.svg`. The mark alone is `public/mark.svg`. This replaces the earlier green and ivory SK Capital look.

## Sample checks

`python3 scripts/verify-samples.py` checks the fictional sample data and arithmetic. `python3 scripts/check-sample-numbers.py` recomputes the figures independently. Both write local reports under ignored `review-artifacts/`. Example amounts are fictional US dollars, not fees and not exchange rates.

For a self-contained offline review, build with `npm run build -- --mode standalone --outDir review-artifacts/standalone`. That build uses hash routing. The normal production build uses browser paths.

## Out of scope

Publishing, DNS and Vercel project settings are intentionally untouched. `vercel.json` is unchanged. Connecting clearfig.in, and replacing the old booking path, are founder decisions.
