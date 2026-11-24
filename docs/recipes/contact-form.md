# Recipe: Production contact form

## Entry conditions

- Baseline has no production contact route or mutation API
- Catalog form demos are local-only (toast), not network-backed

## Implementation order

1. **HTML form** posting to a company-owned endpoint (`PUBLIC_CONTACT_FORM_ENDPOINT` or server action owned by another app)
2. Progressive enhancement for success/error UI
3. Vue island (`client:visible` / `client:idle`) only for multi-step or complex client state

Prefer staying on `output: 'static'` with an external API/serverless function. Adopt an Astro adapter + Actions only when the product truly needs in-Astro server execution (`choose-runtime.md`).

## Required checklist

- Frontend validation (Zod recommended under `src/lib/validation/`)
- Server-side validation on the receiving endpoint
- Honeypot + rate limiting + duplicate-submission protection
- Accessible labels, `autocomplete`, error association
- Preserve field values after validation errors
- Privacy policy link; marketing consent when required
- No secrets in `PUBLIC_*` or client bundles
- Safe error logging

## Acceptance checks

- E2E success and validation-error paths against a mock endpoint
- Works without client JS for the basic submit path when progressive enhancement is claimed
- Console/`pageerror` guards stay clean
- Spam controls documented for the chosen host/API

## Out of scope for shared baseline

- Bundled SMTP credentials
- Captcha by default
- SSR adapter solely to host a contact form

## Adoption ownership

Before enabling a production endpoint, record its service owner, destination and retention period. Enforce schema validation on the server, cap request size and rate, and test invalid submissions and unavailable providers with synthetic data in preview. Record the live provider acceptance with the adopting project.
