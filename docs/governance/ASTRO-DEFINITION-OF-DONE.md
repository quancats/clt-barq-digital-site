# Astro Definition of Done

A change is done only when:

- [ ] The complete approved scope is implemented.
- [ ] Pages remain route orchestrators.
- [ ] Astro components remain the default.
- [ ] Hydration is justified and minimized.
- [ ] No raw API/CMS logic exists in UI files.
- [ ] All active locales are complete.
- [ ] RTL/LTR and responsive behavior are verified.
- [ ] Metadata, canonical, alternates, and indexability are correct.
- [ ] Accessibility states and keyboard behavior are verified.
- [ ] Images, fonts, and client JavaScript are optimized (Tajawal/`ar` or Manrope/`en` preload only; no CDN font CSS).
- [ ] Analytics/third-party behavior matches the env contract (configured/disabled/consent when required).
- [ ] Security and privacy checks pass.
- [ ] Optional host/CMS/consent/form work was not smuggled into baseline without a Feature ID or `docs/recipes/` adoption.
- [ ] Required tests and production build pass.
- [ ] Project documentation and changelog are updated.
- [ ] No undocumented route, island, integration, or content type was introduced.
- [ ] PR and commits reference Feature ID and milestone.
