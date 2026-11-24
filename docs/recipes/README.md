# Astro template recipes

Opt-in adoption guides for this **static, host-neutral** starter.

Baseline stays on **npm**, Node 24, `output: 'static'`, no adapter/CMS SDK/host config files in the repository root (ADR-0017 / ADR-0021). CookieConsent ships in baseline with `PUBLIC_GOOGLE_ANALYTICS_MODE` default **opt-in** (TADR-0002 superseding ADR-0014 default). The consent-aware analytics recipe covers Consent Mode v2, deliberate `opt-out`, and legal wiring. Astro-only header remains a recipe — do not replace HeaderChrome in baseline (ADR-0010).

| Recipe                                                                       | When to use                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [adopting-project-cleanup.md](adopting-project-cleanup.md)                   | Remove demo catalog/articles and hand off template vs product ownership |
| [routing-and-host-redirects.md](routing-and-host-redirects.md)               | Host trailing-slash contract, `/` → `/ar/`, legacy redirect maps        |
| [security-cache-and-csp.md](security-cache-and-csp.md)                       | Host cache/security headers; host CSP vs deferred Astro-native CSP      |
| [choose-runtime.md](choose-runtime.md)                                       | Deciding whether SSR/adapter/Actions/ClientRouter is needed             |
| [cms-integration.md](cms-integration.md)                                     | Moving beyond local Content Collections                                 |
| [consent-aware-analytics.md](consent-aware-analytics.md)                     | Consent Mode v2, Privacy Policy wiring, or deliberate opt-out           |
| [analytics-events-allowlist.md](analytics-events-allowlist.md)               | Custom GA events with consent checks and PII-safe properties            |
| [marketing-pages-and-organization.md](marketing-pages-and-organization.md)   | About/Contact/Legal + Organization JSON-LD                              |
| [portfolio-pages-and-person-jsonld.md](portfolio-pages-and-person-jsonld.md) | Personal/portfolio pages + Person JSON-LD                               |
| [contact-form.md](contact-form.md)                                           | Production lead/contact capture                                         |
| [astro-only-header.md](astro-only-header.md)                                 | Removing the Vue HeaderChrome island (adopting project only)            |
| [font-customization.md](font-customization.md)                               | Replacing Tajawal/Manrope with project fonts                            |
| [profile-favicons.md](profile-favicons.md)                                   | Experiment vs generate favicon assets                                   |
| [content-consistency-gate.md](content-consistency-gate.md)                   | Project-owned content contract / `verify:content` gate                  |

Rules:

1. Do not install dependencies listed in a recipe until the adopting project has an Integrations proposal (and Feature ID/ADR when substantial).
2. Do not invent Organization, legal, or analytics consent copy.
3. Prefer host-level redirects/headers over committing a single-vendor config into the template root.
4. Keep command layers separate: `fix:*` (mutate) → `validate` → `build` → `verify:*` (see governance proposal for central sync).
