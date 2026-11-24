# Astro Performance Release Checklist

- [ ] Static sections ship zero client JavaScript.
- [ ] Hydrated roots and directives are reviewed.
- [ ] Client chunks meet the project budget.
- [ ] LCP media loading and dimensions are deliberate.
- [ ] CLS risks are controlled.
- [ ] Fonts are self-hosted/subsetted via Astro Fonts (Tajawal/`ar`, Manrope/`en` unless overridden); only the active locale family is preloaded.
- [ ] Third-party scripts are minimized; GA4 follows the configured/disabled/opt-out contract (loads by default; `denied` stops collection).
- [ ] Representative production routes meet targets.
- [ ] CMS/build fetching is efficient and failure-safe.
- [ ] Regressions have documented approval.

## Evidence and exceptions

- Evidence:
- Exceptions:
- Owner:
- Follow-up issue:
