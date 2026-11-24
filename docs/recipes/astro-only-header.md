# Recipe: Astro-only header (no Vue chrome)

## Entry conditions

- Baseline ships `HeaderChrome` as one `client:load` island (ADR-0010 / FEAT-PLATFORM-004)
- Content routes budget ≤ 120 KB gzipped for header-related client JS

## When to use

- Product policy requires zero Vue on informational routes
- Measured header JS exceeds budget and NavigationMenu/Select UX can be simplified

## Approach

1. Supersede ADR-0010 with a project ADR (do not silently diverge)
2. Replace `Header.astro` island with Astro markup:
    - Primary nav links (and/or `details`/`summary` explore menu)
    - Language links (no Select)
    - Theme control via a small Astro script (bootstrap in `BaseLayout` already exists)
3. Keep real `<noscript>` fallbacks
4. Remove unused Vue imports from the header path; do not delete the catalog island
5. Remeasure `npm run test:budget` and update Playwright coverage

## Acceptance checks

- Content routes: 0 Vue hydrated roots for header
- Lang switch, theme persistence, mobile nav, RTL/LTR still work
- axe checks on chrome remain acceptable
- PERFORMANCE-BUDGET and ISLAND-MAP updated

## Out of scope

- Deleting the `/components` catalog island
- Shipping both Vue and Astro headers in parallel in baseline
