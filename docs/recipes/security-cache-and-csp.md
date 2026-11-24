# Recipe: Security headers, cache, and CSP

## Entry conditions

- Static host/CDN serves `dist/`
- Baseline does **not** ship `_headers`, `vercel.json`, or `netlify.toml` (ADR-0017)
- Baseline does **not** claim CSP compliance (ADR-0020)

## Cache policy

```text
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# HTML (and non-hashed documents)
/*
  Cache-Control: public, max-age=0, must-revalidate
```

Also enable Brotli/Gzip and HTTP/2 or HTTP/3 at the host.

## Baseline security headers

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
```

Add HSTS only after HTTPS is guaranteed on the production hostname.

## Two CSP paths (do not conflate)

### 1. Host-header CSP (typical for static hosts)

Set `Content-Security-Policy-Report-Only` (then enforce) on the CDN/host. This is the primary recipe for static baselines.

### 2. Astro-native `security.csp` (Astro 6+)

Astro can emit CSP-related configuration from `astro.config`. **Deferred from baseline** because of:

- External GA (`googletagmanager.com` / analytics endpoints) when configured
- Inline theme bootstrap script
- Locally served font build assets (hashed paths; do not hard-code `/_astro/fonts`)

Treat Astro-native CSP as a separate adopting-project experiment. Do not enable it in the shared template without measuring violations and updating GA/theme/font allowances.

## CSP (report-only first)

Start with `Content-Security-Policy-Report-Only` and tighten after reviewing violations.

When GA4 is enabled, allow:

- `script-src` / `connect-src` for `www.googletagmanager.com` / `www.google-analytics.com` (exact set depends on GA config)
- Inline theme bootstrap and gtag init (`'unsafe-inline'` or nonces/hashes — prefer host-supported nonces when available)

Astro Fonts are locally served build assets, so `font-src 'self'` is usually enough. Do **not** require a fixed `/_astro/fonts` path in policy docs.

## Acceptance checks

- Hashed assets cache long-term; HTML revalidates
- Staging remains non-indexable
- CSP report-only does not break theme bootstrap, icons, or optional GA
- Custom 404 serves `404.html`
- Docs do not claim the baseline is CSP-compliant until a measured policy is enforced

## Out of scope

- Committing a single-vendor header file into the shared template root
- Enforcing a strict CSP before measuring production traffic
- Enabling Astro-native `security.csp` in the shared baseline without a new TADR
