# Recipe: Analytics events allowlist

## Entry conditions

- Baseline CookieConsent + mode-aware GA already ship (default **opt-in**).
- Product needs custom `gtag` / dataLayer events beyond automatic page views.

## Goals

- Fire events only after consent allows loading (`mayLoadAnalytics` / stored `granted` for opt-in).
- Allowlist event names and sanitize properties.
- Never send emails, phone numbers, message prefills, query strings, or visible link text as event params.

## Suggested approach

1. Define a project analytics contract (Feature ID + event catalog).
2. Implement an allowlisted dispatcher that checks consent at dispatch time.
3. Use delegated click handlers with stable `data-*` hooks — do not hard-code another site’s CSS selectors.
4. Add PII-negative unit tests.
5. Keep commercial taxonomies (`case_study_view`, WhatsApp CTAs, etc.) project-owned.

## Acceptance checks

- Events cannot fire before consent policy allows GA
- Unknown event names are rejected
- Sanitizer strips URLs/query/PII fields
- Docs list every production event name and properties

## Out of scope

- Copying Quancats/Quanizon event names or marketing CTA selectors into the template
- Adding an analytics npm SDK
