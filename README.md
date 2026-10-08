# SK Capital website

A small, single-page React + Vite site for Business Performance Advisory: problem-led analysis of profit, cash, growth and marketing performance, with practical planning, reporting and focused AI workflows. The visual direction uses warm white, deep green and restrained lime accents, with open-source Newsreader headings and Inter body text. This is inspired by the current clean editorial feel of bcg.com; it does not use BCG branding, proprietary fonts or assets. Editable source replaces the legacy compiled export; do not publish the old root-level assets or the separate rejected redesign.

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

`npm test` covers country mapping, persistence, error handling, API response caching, and ten sample-data, geometry and currency tests. `npm run test:ui` bundles and tests actual React interactions in jsdom, including region prices, manual override races, old hash routes, repeated mobile-menu interaction, and contact destinations. It is not visual/browser-layout QA.

## Site content

Edit `src/lib/advisory.ts` for the positioning, owner questions, investigation steps and custom capabilities. Edit `src/lib/offers.ts` for the three fixed-scope starter finance projects. The secondary AI workflow setup and its regional fee are in `src/components/Reviews.tsx`. Do not add claims of verified client results or working integrations without evidence. Marketing support means performance analysis using client-supplied data, not campaign management, SEO or content execution. The inline `MarginExample` is a clearly labelled fictional excerpt, not a client result. Its contribution calculation is revenue less the defined direct delivery costs, before shared overheads and tax. All eight services link to integrated example pages under `/samples`. Each example opens with one question, one directly labelled visual and one short takeaway. A closed “Show details” panel offers short Common questions. Input tables, assumptions, calculations and scope each stay in further optional disclosures; the repeated metric block and long explanation have been removed. Chart models are computed from the checked inputs in `src/lib/sample-visuals.ts`, with static CSS/SVG rendering in `src/components/SampleVisual.tsx`. The checked fictional inputs, figures, scenarios and 24 prewritten explanations are in `src/data/service-samples.json`. Example amounts are fictional USD values, explicitly separate from regional service fees and not exchange-rate conversions. Their numerical inputs are unchanged; this is a newly denominated illustration. These pages collect no data and make no AI calls. Tables, assumptions and arithmetic are available through native keyboard-accessible disclosures.

Larger engagements are described in `src/components/CustomProjects.tsx`, without fixed prices. Agree scope, deliverables, inputs, tools, timeline and fees before committing. Starter package delivery remains limited to the stated inputs and outputs; bookkeeping, reconciliations and data cleanup are not included. Custom copy does not expand delivery into audit, tax, regulated advice or enterprise-system expertise.

Enquiry CTAs lead to the existing free-intro booking page or the confirmed advisory email. Service examples use internal navigation. No signup, payment, email-submission or data-upload backend is claimed. Links open the booking service or the visitor's email app. No message is sent automatically.

## Regional currency

`api/country.js` reads Vercel's documented `x-vercel-ip-country` request header and returns only a country code with private/no-store caching. It never returns an IP address or stores geography. The browser suggests INR for India, AED for UAE, and USD otherwise. A manual choice always wins and persists in localStorage when available. No third-party geolocation service or device location request is used.

The local Vite/static preview has no Vercel headers, so it safely falls back to USD. Prices are independently set regional fixed-scope fees, not exchange-rate conversions. Country detection is approximate and can differ under VPNs or proxies.

Official references:
- https://vercel.com/docs/headers/request-headers#x-vercel-ip-country
- https://vercel.com/docs/functions/runtimes/node-js

## Publish review / handoff

1. Use the draft PR branch `codex/final-service-examples`, not the older launch-candidate PR.
2. In the existing Vercel project, verify its connected repository is `advisory-gif/sk-capital` and that its domain is the intended `www.skcapital.co.in` before publishing. Do not create or connect a different project by guesswork.
3. Review the exact commit from this PR. Build command: `npm run build`. Output directory: `dist`. Install command: `npm ci`. Repository root directory: repository root. `vercel.json` sets the build/output and excludes `/api/` from the SPA rewrite.
4. The `/api/country` Node function must deploy alongside static assets. A plain static-only upload cannot provide automatic country detection, though manual currency and USD fallback still work.
5. Check the preview at desktop and mobile widths; check all three currencies, reload after manual selection, booking and email links, and `/pricing` plus `/#/pricing` old links. Check `/api/country` returns JSON rather than the HTML app.
6. After the owner approves/publishes, verify the live domain is on the exact reviewed commit and repeat the production smoke checks. No automatic merge or production promotion is part of this draft.

No API keys, third-party credentials, security settings or new account permissions are needed by this code. Hosting plan/commercial-use eligibility must be checked in the owner's Vercel account; this repository does not establish the account's current plan.

## Editorial image and motion

The single hero image is an original AI-generated illustrative financial-planning scene, not an SK Capital team or client photograph. It is labelled in both its caption and alt text. The three WebP sizes (640, 960 and 1440 pixels wide; approximately 26, 43 and 70 KB) share its original 3:2 composition. Explicit dimensions reserve layout space. There are no additional photography requests or animation libraries.

Section entrances are a once-per-mount, 550 ms progressive enhancement. Sections stay fully visible before observation and if the enhancement is unavailable. Reduced-motion preferences disable entrances, hover movement and smooth scrolling; changing the preference during the session also stops observation. Fine-pointer hover moves buttons by 2 pixels and service cards by 3 pixels. There are no repeating animations, parallax, autoplay videos or carousels.

## Service-example verification

`npm run test:ui` also checks the initially collapsed detail panels, one visual per sample, all eight service links and direct routes, the 24 explanatory disclosures, accessible table semantics, focus, browser history, missing examples and currency separation. `python3 scripts/verify-samples.py` checks 610 data and arithmetic assertions; `python3 scripts/check-sample-numbers.py` independently recomputes 74 figures and scenarios. Both create local reports under ignored `review-artifacts/`. No fixed delivery SLA, new service prices, integration guarantees, client-result claims or checkout flow have been added.

For a self-contained offline review, build with `npm run build -- --mode standalone --outDir review-artifacts/standalone`; this uses hash routing. The normal production build retains BrowserRouter and server paths.
