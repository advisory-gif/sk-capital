# SK Capital website

Editable React + TypeScript + Vite source for the SK Capital business-performance website. This branch is a launch candidate for review and manual Vercel deployment; it is **not production-ready yet**. The live contact route and search indexing deliberately remain disabled.

## Run and verify

Use Node.js 20.19+ or 22.12+ and npm. Development was checked with Node.js 24.19.0 and npm 11.9.0.

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run lint
npx tsc -b --force
npm run build
npm test
npm run test:launch
```

- `npm run build` validates launch configuration, type-checks, builds Vite and creates route-specific metadata in `dist/`.
- `npm test` creates a portable HTML preview and runs 15 jsdom interaction checks.
- `npm run test:launch` checks the launch guard and an isolated live-contact fixture with a reserved `example.test` address. No real email is sent and the actual configuration is not changed.
- `npm run build:offline` creates `review-artifacts/sk-capital-review.html`, a self-contained local review file. Open it in a desktop browser. Hash routing and system-font fallbacks are used only in this portable preview; generated preview files are not committed.

The normal website uses BrowserRouter. The portable `/pricing` alias displays the pilot directly; the normal deployment redirects `/pricing` to `/business-health-review`.

## Manual Vercel preview

Use the existing SK Capital project in the correct Vercel account/team. Confirm the project's plan permits this commercial business website and approve any required charge yourself before proceeding. No hosting plan or account setting has been changed by this branch.

Settings expected by this source:

- Framework preset: **Vite**
- Root directory: repository root
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

These build/output settings are also recorded in `vercel.json`. Do not deploy an old root-level compiled export; it has been replaced by editable source plus a reproducible build.

First inspect a preview of this branch with the launch flags still off. Test desktop and phone layouts, navigation, keyboard focus, native dialog behavior, the runway calculator, six sample-model views, direct route loads and Back/Forward. Rendered browser/device QA could not be completed in the preparation environment; passing DOM tests is not a substitute.

## Enable enquiries only after the mailbox works

The root-level `launch-config.json` currently contains:

```json
{
  "launchEnabled": false,
  "contactEmail": "",
  "contactVerified": false
}
```

After an approved **business** mailbox is operational and you have verified receipt of a real test enquiry, edit the same file:

1. Set `contactEmail` to that approved, working business address. Do not put a personal email, password, API key or other secret here; this file is public.
2. Set `contactVerified` to `true` only after the delivery check.
3. Set `launchEnabled` to `true` only after contact, commercial-hosting and rendered browser checks are complete and you are ready to publish.
4. Repeat the checks and inspect the updated branch preview. The CTA should say **Open email draft** and open the visitor's email app with the intended recipient and content.

The website does not send email itself, run a form backend, store enquiry inputs, accept uploads or take payments. Opening a mail draft is **not** a successful submission: the visitor must review and send it in their email app. The mailbox should also be usable directly if the visitor has no default email app.

Live mode hides the preview banner. Search indexing and sitemap generation turn on only when launch/contact are enabled **and** the build is the production Vercel environment (`VERCEL_ENV=production`). Preview/offline builds stay noindex. The build rejects an enabled launch with an empty or unverified contact route.

Once the exact version passes these checks, review and merge the draft PR yourself when appropriate, then publish from the Vercel dashboard. Existing Vercel Git integration may deploy when you merge, so check that project's deployment behavior before merging. This branch does not merge itself, change `main`, enable auto-merge or issue a Vercel deployment.

## Offers and scope

- Revenue Leak Check: ₹1,999 base fee, one entity, up to 10 clean selected quote-to-payment items, one page with three evidence-based priorities, owners and dates, a short explanation and one clarification round.
- Business Pulse: separate, explicit opt-in at a ₹1,999 monthly base fee, with bounded repeat review and action follow-through. No automatic enrolment or unlimited consulting.
- Applicable taxes and the final payable total are confirmed before engagement. Delivery date and explanation format are agreed before work starts; no unconfirmed turnaround or meeting length is promised.
- Broader advisory, cleanup, bookkeeping, reporting systems and implementation need a separate scope. No revenue, profit or recovered-cash result is guaranteed.
- All sample findings and the CloudHR model are synthetic, not client results.

## Source migration and review notes

At preparation, `main` was `b192dd0b50d76c09172f2e17cced91923177d59d` and contained only the compiled site export. The editable source lineage came from `codex/business-health-revamp` at `9594f962d5264e9b00cc1d56b450dedfe323daf6`; `main` was its ancestor, with no intervening main changes to preserve.

This PR includes the required source, public assets, lockfile, tests and build configuration. Old compiled root assets are removed and image assets move to `public/images`. Dependencies, build outputs, offline HTML, source ZIPs, environment files and credentials are not committed. Older source/positioning PRs remain untouched; do not merge those separately without reconciling them with this complete source migration.

See `LAUNCH_PREPARATION.md` for remaining launch checks. `REVIEW_CHECKS.txt` records the initial review checks; the fresh PR test results are reported in the PR description.
