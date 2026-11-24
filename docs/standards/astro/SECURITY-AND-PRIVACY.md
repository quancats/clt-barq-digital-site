# Astro Security and Privacy Standard

## Threat model

Informational websites still process content, forms, analytics, CMS credentials, preview access, and third-party scripts. Static output reduces but does not remove risk.

## Environment separation

- secrets are server/build-only
- public environment variables are explicitly public
- client islands must never import server-only modules
- `.env.example` documents every variable without secrets

## Content safety

- validate external data
- sanitize or structurally render rich text
- do not inject untrusted HTML, scripts, CSS, or SVG
- validate link protocols and remote image sources
- prevent draft/private content from production

## Forms

- server-side validation
- rate limiting/spam control
- CSRF strategy where applicable
- minimum personal data
- secure transport
- safe logging and retention
- accessible generic errors that do not reveal internals

## Third-party scripts

Require owner, purpose, data classification, consent category, CSP impact, loading strategy, and removal path.

For GA4 specifically:

- production injection follows `PUBLIC_GOOGLE_ANALYTICS_MODE` (`off` | `opt-out` | `opt-in`, default `opt-out`); stored `denied` always blocks further loads
- default opt-out may load before first choice; do not call it a “consent gate”
- provide an explicit disable path (`PUBLIC_GOOGLE_ANALYTICS_ENABLED=false`, `PUBLIC_GOOGLE_ANALYTICS_MODE=off`, or unset Measurement ID)
- CookieConsent + footer privacy settings show when analytics is configured and mode is not `off`
- Consent Mode v2 / Privacy Policy extensions use `docs/recipes/consent-aware-analytics.md` when needed
- never place secrets in `PUBLIC_*` variables

## Headers and deployment

Define CSP, HSTS, framing, referrer, permissions, and MIME policies at hosting/platform level where possible. Prefer report-only CSP before enforcement when GA or inline theme scripts are present. Host-header CSP and Astro-native `security.csp` are separate paths; Astro-native CSP is deferred from the shared baseline while GA, inline theme bootstrap, and fonts remain unconstrained — do not claim CSP-compliant by default. Verify preview and staging are protected and non-indexable. Platform-specific header/redirect files are opt-in recipes, not required baseline artifacts.
