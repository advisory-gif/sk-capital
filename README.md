# Clearfig website

The public site for Clearfig, formerly SK Capital. Clearfig is a data and business-clarity company. The tagline is "See how your business really makes money." A 360-degree business health check reads customers, products, pricing, channels, marketing and money for growing owner-led businesses, in any sector, anywhere. Clearfig works beside the client's accountant. It is not a bookkeeping, tax, audit or CFO service. The intended domain is [clearfig.in](https://clearfig.in). This repository used to be published as SK Capital at skcapital.co.in. Do not change DNS or Vercel project settings from this codebase.

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

`npm test` covers country mapping, fees staying off the public pages, Clearfig metadata, sample data, chart geometry and contrast. `npm run test:ui` bundles the React app and checks copy, navigation, the unpublished price flag, fictional examples and keyboard behaviour. It is not visual layout QA.

## What the site says

Edit `src/lib/advisory.ts` for the promise, audience, questions, steps, deliverables, trust notes, FAQs and founder biographies.

The public offer is a free 20-minute self-check, then a 360-degree business health check. Scope, inputs, deliverable, timing and fee are agreed before paid work starts. The booking link is `https://cal.com/clearfig/self-check`. The contact email is `hello@clearfig.in`.

The site does not publish fees, guarantees, client names or testimonials. `src/lib/publication.mjs` exports `showPrices` as `false`. The older starter amounts in `src/lib/offers.ts` are not rendered.

Examples under `/samples` use the existing fictional US dollar data. They are labelled as examples, not client results. `src/data/service-samples.json` is unchanged.

The site does not claim bookkeeping, tax, audit, regulated accounting, client results, testimonials, or a security certification.

## Photographs

The homepage does not use photographs. Its charts are drawn in the page and are not client results. The details page uses two photographs of the kind of work Clearfig is about. They are not Clearfig clients, offices, or reports. Unsplash photos are free to use under the [Unsplash License](https://unsplash.com/license), including commercial use. Attribution is not required. Credits are on the page and here.

| File | Subject | Photographer | Source |
|---|---|---|---|
| `public/images/reviewing-numbers-640.webp`, `960`, `1440` | Person reviewing notes beside a laptop | Scott Graham | [Unsplash](https://unsplash.com/photos/person-holding-pencil-near-laptop-computer-5fNmWej4tAA) |
| `public/images/charts-desk-800.webp`, `1200` | Laptop with charts and a notebook | Carlos Muza | [Unsplash](https://unsplash.com/photos/laptop-computer-on-glass-top-table-hpjSkU2UYSU) |

Scott Graham is eager-loaded. Carlos Muza is lazy-loaded. Both are WebP, with width and height set. Alt text says the photo is illustrative.

## Visual system

Warm paper (`#F6F3EE`), ink (`#1C1714`), fig (`#5C2A38`) and leaf (`#4E6B3A`). The homepage is paper, with a one-pixel fig rule and charts drawn beside the words. Headlines use Newsreader. Body text, navigation and chart figures use Inter. Georgia and system-ui are the fallbacks. The faces are self-hosted from `@fontsource`, the Vite equivalent of `next/font/google`. The surface is flat: no gradients and no drop shadows. The wordmark is the ripe-fig logo: a fig in fig, a leaf in leaf, “Clear” in ink and “fig” in fig (`public/logo.svg`, `src/components/Logo.tsx`). Browser icons are the ripe-fig mark at `public/favicon-32.png`, `public/favicon-180.png` and `public/favicon-512.png`. The mark alone is `public/mark.png` (and `public/mark.svg`). Reversed and single-colour files are `public/logo-reversed.svg` and `public/logo-mono.svg`. This replaces the earlier green and ivory look.

## Sample checks

`python3 scripts/verify-samples.py` checks the fictional sample data and arithmetic. `python3 scripts/check-sample-numbers.py` recomputes the figures independently. Both write local reports under ignored `review-artifacts/`. Example amounts are fictional US dollars, not fees and not exchange rates.

For a self-contained offline review, build with `npm run build -- --mode standalone --outDir review-artifacts/standalone`. That build uses hash routing. The normal production build uses browser paths.

## Out of scope

DNS and Vercel project settings are intentionally untouched. `vercel.json` is unchanged. Connecting clearfig.in is a separate decision. The booking path on the site is the Clearfig self-check link.
