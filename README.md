# SK Capital website

A small, single-page React + Vite site for starter finance projects and tailored planning, reporting and implementation for small service businesses. The visual direction uses warm white, deep green and restrained lime accents, with open-source Newsreader headings and Inter body text. This is inspired by the current clean editorial feel of bcg.com; it does not use BCG branding, proprietary fonts or assets. Editable source replaces the legacy compiled export; do not publish the old root-level assets or the separate rejected redesign.

## Run and check

Use Node.js 22 or newer.

```
npm ci
npm run lint
npm test
npm run test:ui
npm run build
npm run dev -- --host 127.0.0.1
```

`npm test` covers country mapping, persistence, error handling and API response caching. `npm run test:ui` bundles and tests actual React interactions in jsdom, including region prices, manual override races, old hash routes, repeated mobile-menu interaction, and contact destinations. It is not visual/browser-layout QA.

## Site content

Edit `src/lib/offers.ts` for the three fixed-scope starter finance projects. The secondary AI workflow setup and its regional fee are in `src/components/Reviews.tsx`. Do not add claims of verified client results or working integrations without evidence.

Larger engagements are described in `src/components/CustomProjects.tsx`, without fixed prices. Agree scope, deliverables, inputs, tools, timeline and fees before committing. Starter package delivery remains limited to the stated inputs and outputs; bookkeeping, reconciliations and data cleanup are not included. Custom copy does not expand delivery into audit, tax, regulated advice or enterprise-system expertise.

All CTAs lead to the existing free-intro booking page or the confirmed advisory email. No signup, payment, email-submission or data-upload backend is claimed. Links open the booking service or the visitor's email app. No message is sent automatically.

## Regional currency

`api/country.js` reads Vercel's documented `x-vercel-ip-country` request header and returns only a country code with private/no-store caching. It never returns an IP address or stores geography. The browser suggests INR for India, AED for UAE, and USD otherwise. A manual choice always wins and persists in localStorage when available. No third-party geolocation service or device location request is used.

The local Vite/static preview has no Vercel headers, so it safely falls back to USD. Prices are independently set regional base fees, not exchange-rate conversions. Country detection is approximate and can differ under VPNs or proxies.

Official references:
- https://vercel.com/docs/headers/request-headers#x-vercel-ip-country
- https://vercel.com/docs/functions/runtimes/node-js

## Publish review / handoff

1. Use the draft PR branch `codex/expand-custom-finance-projects`, not the older launch-candidate PR.
2. In the existing Vercel project, verify its connected repository is `advisory-gif/sk-capital` and that its domain is the intended `www.skcapital.co.in` before publishing. Do not create or connect a different project by guesswork.
3. Review the exact commit from this PR. Build command: `npm run build`. Output directory: `dist`. Install command: `npm ci`. Repository root directory: repository root. `vercel.json` sets the build/output and excludes `/api/` from the SPA rewrite.
4. The `/api/country` Node function must deploy alongside static assets. A plain static-only upload cannot provide automatic country detection, though manual currency and USD fallback still work.
5. Check the preview at desktop and mobile widths; check all three currencies, reload after manual selection, booking and email links, and `/pricing` plus `/#/pricing` old links. Check `/api/country` returns JSON rather than the HTML app.
6. After the owner approves/publishes, verify the live domain is on the exact reviewed commit and repeat the production smoke checks. No automatic merge or production promotion is part of this draft.

No API keys, third-party credentials, security settings or new account permissions are needed by this code. Hosting plan/commercial-use eligibility must be checked in the owner's Vercel account; this repository does not establish the account's current plan.
