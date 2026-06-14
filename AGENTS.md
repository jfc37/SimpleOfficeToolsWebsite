# Website Instructions

## Scope

These instructions apply to the marketing and purchase-flow website under `SimpleOfficeTools.Website`.

## Workflow And Content Boundaries

- Keep the website aligned with actual product behavior in the desktop app and backend. Do not add or imply features, limits, pricing, or setup flows that the product does not support.
- Treat `pricing*.html`, `checkout*.html`, `purchase-completed*.html`, `download.html`, and `simply-sign.html` as contract-sensitive pages. Small copy or script changes there can affect checkout completion, app activation, or token/licence linking.
- When a prod/dev page pair exists, keep both paths intentionally aligned unless the task explicitly requires an environment-specific difference.

## Purchase And Deep-Link Guardrails

- Preserve the `simpleofficetools://paddle/...` deep-link behavior unless the task explicitly requires changing the desktop app handoff contract.
- Preserve query parameter names, redirect intent, and download/appinstaller targets unless the corresponding app/backend contract is being updated at the same time.
- Do not change product pricing, SKU wiring assumptions, checkout return behavior, or installer destinations unless the task explicitly requires it.

## Editing Guidelines

- Keep static HTML, CSS, and small script changes easy to diff and review. Avoid broad reformatting of entire pages.
- Prefer reusing the existing site structure and shared assets under `assets/` before introducing page-specific duplicates.
- Keep marketing copy specific and accurate. Favor product-supported wording over aspirational wording.

## Validation

- Inspect any matching dev/prod pages together when editing shared purchase or pricing behavior.
- Review relevant release checks in `PRE_RELEASE_CHECKLIST.md` when changing website purchase, download, or pricing flows.
- If no automated validation exists for the page you changed, state that validation was limited to static review.
