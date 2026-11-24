# Astro Deployment and Operations Standard

## Static default

Deploy generated output to a CDN/static host. Document:

- package manager and lockfile (starter baseline: **npm** with `package-lock.json` / `npm ci` only — not pnpm)
- build command (`npm run build` — artifact only; run `validate` before build in CI/local)
- output directory
- Node version (`>=24 <25` / `.nvmrc` `24` for current Astro 7 baseline)
- environment values (`ENV` work environment; `PUBLIC_SITE_URL` absolute production origin; GA Measurement ID, enable flag, and `PUBLIC_GOOGLE_ANALYTICS_MODE`)
- cache policy (`/_astro/*` immutable; HTML revalidate)
- redirects/headers including trailing-slash + directory host contract (host-specific files are opt-in recipes)
- deployment rollback (prefer CI `static-dist` artifact when available, retention documented in project DEPLOYMENT)
- CMS rebuild trigger when applicable

Do not require an adapter for fully static marketing sites. Do not commit a second lockfile.

## CI quality path

Recommended sequence (see `TESTING.md` §15–17):

```text
npm ci
-> npm run validate
-> npm run build
-> npm run verify:budget && npm run verify:links && npm run verify:e2e
-> upload dist/ artifact (e.g. static-dist, 14-day retention)
```

Rules:

- Do not run `fix:*` in CI
- Do not embed `astro check` / `vue-tsc` inside `build` when `validate` already ran
- `verify:e2e` uses existing `dist/`; do not rebuild inside the e2e script

Trigger policy is project-owned: automatic on `push`/`pull_request` **or** manual `workflow_dispatch` only — document the choice.

## Adapter-based deployment

An official adapter is selected only for approved on-demand requirements. Document runtime limits, cold starts, region, logs, cache controls, image behavior, and health monitoring.

## Environments

- local
- preview/PR
- staging
- production

Preview and staging are protected or `noindex`; private content requires authentication, not robots rules alone.

## Operational checks

- broken links
- route generation count
- sitemap and robots
- environment validation
- webhook signature and retry
- error reporting
- Core Web Vitals
- backup/rollback for CMS content owned by backend
