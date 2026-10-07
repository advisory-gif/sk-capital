# Launch checklist

The branch is a reviewable source candidate. Do not treat a passing build as approval to publish it.

## 1. Confirm hosting and project settings

Use the existing SK Capital Vercel project in the intended account/team. Confirm its plan permits this commercial business website, and review any cost before upgrading or purchasing anything.

- Framework: Vite
- Root directory: repository root
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`

Check whether the existing Git integration creates previews on branch pushes or deploys production on a merge. No merge or Vercel deployment is performed by this PR.

## 2. Verify the business contact route

Choose an approved business mailbox and verify that it receives a real test enquiry. Do not publish a personal address or include credentials in the repository.

Then edit root-level `launch-config.json`:

- `contactEmail`: the approved, working business email address
- `contactVerified`: `true` only after successful delivery verification
- `launchEnabled`: `true` only when the remaining checks below are complete and publication is intended

All three settings currently remain safely disabled: `launchEnabled=false`, `contactVerified=false`, and `contactEmail=""`.

The contact CTA opens an email draft in the visitor's own email app. They must review and send it themselves. The website never reports that a message was sent and does not store enquiry inputs. A directly readable email address is also provided in live mode for visitors without a default email app.

No form backend, mailbox service, booking system or checkout is configured by this code.

## 3. Review the commercial offer

- Revenue Leak Check: ₹1,999 base fee, one entity, up to 10 clean selected items, three evidence-based priorities on one page, owners/dates, a short explanation and one clarification round.
- Business Pulse: separate opt-in at a ₹1,999 monthly base fee, with a bounded repeat check and action follow-through. No automatic enrolment.
- Confirm applicable taxes, the final payable amount, service details and cancellation/payment terms with the prospect before commitment.
- Agree a delivery date and explanation format before starting. No fixed turnaround or meeting length is promised.
- Broader advisory, cleanup and implementation require a separate scope. Samples are fictional, and no outcome or recovered amount is guaranteed.

## 4. Check the rendered preview

Rendered browser/device QA remains outstanding. At minimum, test:

- Desktop and phone layouts, overflow, text size and contrast
- Keyboard navigation, visible focus, menu open/close and Escape
- Runway calculator input validation, native dialog close/focus behavior
- All six sample-model views and scrollable data tables
- Primary CTAs, anchor links, direct route loads, `/pricing`, Back and Forward
- Live-mode email recipient, subject/body encoding and honest draft wording

The automated tests use a DOM emulator and cannot establish these visual or native-browser behaviors.

## 5. Verify, then publish the exact reviewed version

```sh
npm ci
npm run lint
npx tsc -b --force
npm run build
npm test
npm run test:launch
```

The launch build rejects an enabled configuration with an empty or unverified contact address. Indexing and sitemap generation are enabled only when launch/contact are enabled and `VERCEL_ENV=production`. Preview and offline builds remain noindex.

After review, merge the PR yourself only when its changes should reach the production branch, taking the project's automatic deployment behavior into account. Publish or promote from the existing Vercel dashboard as appropriate. Verify the resulting domain, version, routes, contact behavior and indexing.
