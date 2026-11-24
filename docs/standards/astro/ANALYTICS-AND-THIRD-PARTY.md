# Analytics and Third-Party Script Standard

## Approval record

Every third-party integration documents:

- business owner
- purpose
- domains/scripts loaded
- personal or device data collected
- consent category
- environments
- load timing
- CSP requirements
- performance impact
- removal procedure

## Google Analytics 4 (baseline pattern)

Prefer the official `gtag.js` snippet. Do **not** add an analytics npm SDK for GA4 unless a separate dependency proposal and ADR approve it.

### Production enablement

In production builds:

- resolve GA4 when `PUBLIC_GOOGLE_ANALYTICS_ID` is a valid Measurement ID (`G-XXXXXXXX`)
- require `PUBLIC_GOOGLE_ANALYTICS_ENABLED` not explicitly `false` (default `true`)
- honor `PUBLIC_GOOGLE_ANALYTICS_MODE`: `off` | `opt-out` | `opt-in` (default `opt-out`; invalid values fall back to `opt-out`)
- disable by either:
  - setting `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false`,
  - setting `PUBLIC_GOOGLE_ANALYTICS_MODE=off`, or
  - leaving `PUBLIC_GOOGLE_ANALYTICS_ID` unset / empty

`PUBLIC_ANALYTICS_CONSENT_REQUIRED` is removed; do not reintroduce an env that hides preference UI while ignoring stored denial.

### Development

Do not inject analytics in `astro dev` / local development by default. Keep local traffic out of production properties.

### Preference UI and modes (baseline)

- Ship a bilingual CookieConsent surface in the shared baseline when analytics is configured and mode is not `off`
- Footer privacy-settings control (`data-privacy-settings`) reopens CookieConsent
- Persist a versioned non-PII preference JSON `{ state: 'granted'|'denied', version: 1 }` at `localStorage` key `analytics-consent` (legacy plain strings may still parse)
- Stored `denied` is **always** honored when a mode allows analytics; hiding UI must not ignore denial
- **opt-out (default):** inject `gtag.js` when configured unless preference is `denied` (may load before first choice). Reject cannot retract already-sent pageviews
- **opt-in:** inject only when preference is `granted`
- **off:** never inject; do not show preference UI
- Do **not** call default opt-out behavior a “consent gate”
- Unset Measurement ID omits both analytics scripts and the preference UI
- Consent Mode v2 defaults, Privacy Policy wiring, and advanced legal copy are adopting-project extensions (see `docs/recipes/consent-aware-analytics.md` when present)
- Adopting projects own legal copy customization, retention, and regional compliance

## Loading

- production-only by default
- defer non-critical scripts
- honor analytics mode + stored preference via CookieConsent in the shared baseline (see above)
- avoid duplicate analytics products
- do not send form values or sensitive identifiers
- prefer server-side/privacy-preserving collection when suitable
- verify CSP compatibility before enforcement (report-only first when introducing GA); baseline does not claim CSP-compliant

## Platform-neutral adoption

Host headers, CSP files, CMS SDKs, and adapters remain opt-in recipes. Baseline GA4 + CookieConsent are shared starter features with Feature IDs and acceptance criteria; do not add further third-party runtimes without ownership and approval.

## Review

A script is rejected when its benefit is unclear, data behavior is unknown, it cannot comply with the project’s preference/consent policy, or it materially harms performance without approval.
