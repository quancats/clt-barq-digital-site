# Cursor Rule — Astro Security and Privacy

## Environment

Secrets remain server/build-only. Client bundles may use only intentionally public configuration. Do not import server-only modules into islands.

## Content

Validate all external data. Use structured rendering or approved sanitization. Do not render untrusted HTML, scripts, styles, or raw SVG.

## Forms

Require server validation, abuse controls, minimal data collection, safe error mapping, and privacy-aware logging/retention.

## Third parties

Analytics, embeds, maps, and scripts require an approved owner, data classification, consent category, CSP impact, loading strategy, and removal plan.

For GA4: inject official `gtag.js` in production when a valid Measurement ID is configured unless `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false`, `PUBLIC_GOOGLE_ANALYTICS_MODE=off`, the ID is unset, or mode/preference blocks load. Default mode is opt-out (may load before first choice; stored `denied` always honored) — do not call it a consent gate. Consent Mode v2 / stricter `opt-in` remain optional. Never put secrets in `PUBLIC_*`.

## Environments

Protect preview/drafts and staging. `robots.txt` alone is not access control. Review CSP and platform security headers before release. Host-header CSP and Astro-native `security.csp` are separate; baseline does not claim CSP-compliant.
