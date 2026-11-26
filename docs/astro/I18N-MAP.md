# I18N Map

## Policy

- Locales: `ar`, `en`
- Default: `ar`
- Arabic is unprefixed. English uses `/en/`.
- Directions: `ar=rtl`, `en=ltr`
- Fonts: local IBM Plex Sans Arabic for both languages, with the regular WOFF2 preloaded.
- Dictionaries: mirrored TypeScript modules with `snake_case` keys
- Vue / Reka UI islands wrap with `RekaLocaleProvider` (`ConfigProvider` `dir` + `locale`) so primitives do not fall back to LTR
- URL shape: trailing slash (`trailingSlash: 'always'` + directory build; host must honor ADR-0016 contract)

## Route localization

| Concept           | ar                  | en                     |
| ----------------- | ------------------- | ---------------------- |
| Home              | `/`                 | `/en/`                 |
| Articles index    | `/articles/`        | `/en/articles/`        |
| Article detail    | `/articles/{slug}/` | `/en/articles/{slug}/` |
| Component catalog | `/components/`      | `/en/components/`      |

## Dictionaries

| Module       | Keys (selected)                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`     | nav keys, `header_cta`, breadcrumbs, footer note/nav/social/`footer_copyright` (`{year}` `{brand}`)/made-with/columns                                                                           |
| `common`     | `close`, `more_pages`, `loading`, `previous`/`next` (+ slide), theme labels, brand, `rss_description`, PWA short name/description, `cookie_consent.*` (incl. `privacy_settings`), `error.titles | descriptions | actions` (404/500/generic) |
| `home`       | `cta_articles`, `cta_components`, hero copy                                                                                                                                                     |
| `components` | page chrome, `icons_demo`, category labels, shared demo actions, nested `demo.*` catalog copy, and per-component `name`/`description`                                                           |

## Language switcher

Implemented as `LanguageSwitcher` (icon-only Select + `location.assign`) inside `HeaderChrome`, with noscript `<a>` fallbacks in `Header.astro`.

This is an intentional baseline exception to link-only language switching guidance (see ADR-0010 / ADR-0019): the Select keeps header chrome cohesive with theme control; real links remain available without JavaScript.

1. Resolve current route identity
2. Prefer translated article via `translationGroup` (page passes `alternatePath`)
3. Else map known static route equivalents (including `/components`)
4. If a route has no real counterpart, show a localized unavailable label and omit its alternate URL. Dates use Gregorian UTC formatting, and numbers use the active locale.

## Theme labels

The mirrored `common` dictionaries must provide:

- `theme_label`
- `theme_light`
- `theme_dark`
- `theme_auto`

## Catalog demo copy

`ComponentCatalog` receives `components` dictionary fields plus shared `common` chrome labels (`close`, `loading`, `more_pages`, `previous`, `next`, slide labels). All interactive demo strings live under `components.demo` and must stay mirrored for `ar`/`en`.

## Default-locale metadata

Single-file surfaces that cannot vary by URL locale use the default locale (`ar`) dictionaries:

- `/rss.xml` → `common.brand` + `common.rss_description`
- `public/manifest.webmanifest` → Arabic brand/short name/description aligned with `common`

## SEO

- Canonical is locale-specific
- Reciprocal `hreflang` when translation exists
- `x-default` on the home page points to the default locale home (`/`). Template policy treats the default-locale home as the language-default landing URL (not a separate language-neutral selector page).
- Open Graph + Twitter cards use `/images/og/default.png` unless a page supplies `seo.image`
- Home emits `WebSite` JSON-LD (optional `linkPerson` for portfolio sites)
- Parameterized `Organization` / `Person` JSON-LD helpers ship without identity data; wire via marketing/portfolio recipes
- Article routes emit `article:published_time` / `article:modified_time` and `Article` JSON-LD
- Breadcrumb trails on articles/components emit `BreadcrumbList` JSON-LD
- `robots.txt` is generated from `PUBLIC_SITE_URL` / `Astro.site` and allows crawling only when `ENV=production` and the origin is not the fallback example origin
