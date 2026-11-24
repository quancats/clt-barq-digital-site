# Deployment Plan

## Target

Cloudflare Workers Static Assets serves `dist/` using the assets-only Wrangler configuration in the [routing recipe](../recipes/routing-and-host-redirects.md).

## Astro config (baseline)

| Option          | Value             | Notes                                                                                             |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| `output`        | `'static'`        | All routes prerender by default; no SSR adapter in baseline (ADR-0001, ADR-0016)                  |
| `trailingSlash` | `'always'`        | Canonical public URLs keep a trailing slash (ADR-0016); see [ROUTE-MAP](ROUTE-MAP.md)             |
| `build.format`  | `'directory'`     | Emits `dist/.../index.html` on disk (ADR-0016)                                                    |
| `site`          | `PUBLIC_SITE_URL` | Absolute origin for canonical, sitemap, robots.txt, and RSS                                       |
| `prefetch`      | viewport          | `prefetchAll: false`, `defaultStrategy: 'viewport'`; links must opt in with `data-astro-prefetch` |
| `devToolbar`    | enabled           | Explicit `devToolbar.enabled: true` in baseline                                                   |

Adopting projects that load remote images should add `image.remotePatterns` for their CDN hostnames; the template does not ship a placeholder CDN pattern.

### Host URL contract (required)

With `trailingSlash: 'always'` and `build.format: 'directory'`, the host must:

1. Serve `/about/` from `/about/index.html` (and the same for locale routes such as `/ar/articles/`)
2. Redirect `/about` → `/about/` when both would otherwise be reachable
3. Redirect `/` to the default locale via the generated `dist/_redirects`

Do not commit vendor host files (`vercel.json`, `netlify.toml`, `_headers`) in the template root. Configure the contract on the adopting host; see [routing-and-host-redirects.md](../recipes/routing-and-host-redirects.md). Verify after every real deploy (ADR-0016 follow-up).

## Package manager

Use **npm** with the committed `package-lock.json` (`npm ci`). Do not introduce a second lockfile or switch the template to pnpm (ADR-0017 / ADR-0021). Checklist wording that recommends `pnpm install --frozen-lockfile` is satisfied here by `npm ci`.

Pin Node with [`.nvmrc`](../../.nvmrc) (`24`), matching `engines.node` (`>=24 <25`) and CI `node-version-file: '.nvmrc'`.

## CI quality path

[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs **only on manual `workflow_dispatch`** (Actions → CI → Run workflow). It does not run on `push` or `pull_request`. Use `npm run ci:local` (or `validate` → `build` → `verify`) for local/PR quality gates.

When dispatched, the workflow:

1. `npm ci`
2. Format check (`format:check`)
3. Lint
4. Astro check
5. Vue typecheck
6. Unit tests
7. Static preview build (`astro build` only — type gates already ran above)
8. Performance budget check (`verify:budget`) — default perf gate instead of Lighthouse CI
9. Internal broken-link check (`verify:links`)
10. Static SEO and redirect check (`verify:seo -- preview`)
11. Playwright Chromium smoke tests (`verify:e2e`; upload report artifacts on failure)
12. Upload verified `dist/` as artifact `static-dist` (retention **14 days**) after Playwright succeeds

Concurrency cancels older runs on the same ref. Deploy, PR preview hosting, deployment secrets, and uptime wiring remain **adopter/host** owned (ADR-0017 / ADR-0021). Prefer deploying the CI-generated `static-dist` artifact over building production assets manually on low-memory servers. Adopters who want automatic PR/`main` CI should re-enable `push` / `pull_request` triggers in their fork.

## Build

```bash
npm ci
npm run validate   # source gates (optional locally; CI runs these before build)
npm run build      # artifact only
npm run verify     # budget + links + SEO + e2e (requires a default preview build)
```

Set `ENV=production` and `PUBLIC_SITE_URL` to the real production origin before deploying. Production builds fail when the origin is unset, invalid or an example hostname. `astro.config.ts` loads `.env*` via Vite `loadEnv` because config evaluates before normal Vite env injection. `robots.txt` allows crawling only when `ENV=production` **and** the origin is not the template fallback.

## Environment

| Variable                          | Required in production | Notes                                                                                                                                |
| --------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ENV`                             | Yes                    | Work environment: `local` \| `staging` \| `production`. Import via `astro:env/server`. Production indexing requires `production`     |
| `PUBLIC_SITE_URL`                 | Yes                    | Absolute http(s) origin for canonical, sitemap, robots.txt, RSS. Also in `astro:env/server`. Do not ship `example.com` to production |
| `PUBLIC_DEFAULT_THEME`            | No                     | `light`, `dark`, or `auto`; defaults to `auto` in schema                                                                             |
| `PUBLIC_GOOGLE_ANALYTICS_ID`      | No                     | GA4 Measurement ID (`G-…`). In production, eligible when valid unless disabled / mode `off`. Leave unset to skip GA injection.       |
| `PUBLIC_GOOGLE_ANALYTICS_ENABLED` | No                     | Defaults to `true`. Set `false` to disable GA4 and hide analytics preference UI                                                      |
| `PUBLIC_GOOGLE_ANALYTICS_MODE`    | No                     | `off` \| `opt-out` \| `opt-in` (default **`opt-in`**). Opt-in waits for `granted`; stored `denied` is always honored. See TADR-0002. |

`PUBLIC_ANALYTICS_CONSENT_REQUIRED` was removed; use `PUBLIC_GOOGLE_ANALYTICS_MODE`. Legacy `SITE_URL` is no longer read — migrate to `PUBLIC_SITE_URL`.

`PREVIEW_CRAWL_POLICY` defaults to `public` for local and staging. Use `npm run verify:seo -- private-preview` to verify a private preview artifact. Production uses its production indexing policy.

## Output

- `dist/` static assets and HTML (`output: 'static'`)
- sitemap and sitemap references generated only for indexable production builds
- `/robots.txt` generated from `PUBLIC_SITE_URL` / `Astro.site`; uses the configured preview crawl policy (see `src/lib/seo/robots.ts`)
- Sitemap excludes error pages, redirect sources, RSS/robots, `.well-known` and rendered `noindex` pages
- Structured-data helpers: WebSite (optional `linkPerson`), Article, BreadcrumbList, plus parameterized Organization/Person factories with **no shipped identity data**
- `/rss.xml` feed
- `/manifest.webmanifest`, `/apple-touch-icon.png`, `/images/og/default.png`

## Hosting checklist (platform-owned)

Configure on the static host / CDN (not in the Astro baseline repo unless a platform config file is approved):

- HTTPS + HTTP→HTTPS redirects
- One canonical hostname (`www` or apex)
- Host URL contract above (trailing slash + directory format)
- Long-cache hashed `/_astro/*` assets: `Cache-Control: public, max-age=31536000, immutable`
- HTML pages: `Cache-Control: public, max-age=0, must-revalidate`
- Brotli/Gzip, HTTP/2 or HTTP/3
- Reliable cache invalidation on deploy
- Custom 404 → `404.html` (baseline emits this from `src/pages/404.astro`)
- Optional custom 500 → `500.html` (baseline emits this from `src/pages/500.astro`; map host origin errors to it)
- Authentication on private staging hostnames
- Security headers as required by the adopting project (CSP report-only first); see [security-cache-and-csp.md](../recipes/security-cache-and-csp.md). Baseline does not claim CSP compliance; Astro-native `security.csp` is deferred (ADR-0020)
- Trailing-slash / locale redirects when the host would otherwise expose duplicates; see [routing-and-host-redirects.md](../recipes/routing-and-host-redirects.md)

## Preview / staging

- Create a preview deployment per pull request on the adopting host when available
- Public previews emit `noindex` and allow crawling. Private previews require host authentication and can add `PREVIEW_CRAWL_POLICY=private` to block crawling.
- Do not point production DNS at preview
- Store deployment secrets in the CI/host provider; do not commit them

## Rollback

Redeploy a previous verified CI artifact (`static-dist`, retained **14 days**) and/or rebuild from a previous git SHA. Confirm the host supports instant rollback or re-promote of the last known-good deploy.

## Replacing an existing website

Before cutover, collect the old public URL inventory (crawl, Search Console, analytics, sitemap). Map each important old URL to the closest relevant new URL with a **permanent** redirect. Avoid redirecting every legacy path to the homepage. Extend the adopting project's shared redirect map (recipe examples in [routing-and-host-redirects.md](../recipes/routing-and-host-redirects.md)).

## Adopter operations (outside starter runtime)

Configure in the adopting project / hosting account as needed. The template does not ship verification meta tags, Sentry SDK, uptime agents, or notification wiring:

- Google Search Console and Bing Webmaster Tools verification
- Sentry (or equivalent) error monitoring when the product requires it
- Uptime monitoring for the production origin
- Contact-form failure alerts (when a form recipe is adopted)
- Deployment failure notifications (CI/CD or host webhooks)

Baseline analytics remains production GA4 with CookieConsent and `PUBLIC_GOOGLE_ANALYTICS_MODE` default **opt-in** (TADR-0002). Deliberate pre-choice loading uses `opt-out`; Consent Mode v2 and legal wiring use [consent-aware-analytics.md](../recipes/consent-aware-analytics.md).
