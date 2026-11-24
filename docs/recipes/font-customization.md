# Recipe: Font customization

## Baseline

- Arabic pages selectively preload Tajawal (`--font-tajawal`) weight `400` / subset `arabic`
- English pages selectively preload Manrope (`--font-manrope`) weight `400` / subset `latin`
- Mapping via `html[lang]` → `--font-document` (ADR-0015)
- Fonts are locally served build assets; do not guarantee a `/_astro/fonts` public path

## How to swap families

1. Register replacements in `astro.config.ts` using Astro Fonts providers (`google`, `fontsource`, `npm`, or `local`)
2. Keep weights limited (typically `400` / `500` / `700`) and subsets to what the locale needs
3. Update `BaseHead` selective `preload={[…]}` lists (weight + subset) and `global.css` `html[lang]` mapping — do not use a boolean `preload` that pulls all variants
4. Avoid Google Fonts CSS CDN `@import`
5. Prefer licensed WOFF2 self-hosting when using `local`

## Acceptance checks

- Active locale family is selectively preloaded; inactive family is not required on first paint
- `font-sans` / headings render with the intended family per locale
- Build emits fonts as site-owned assets (`font-src 'self'` is enough for CSP drafts)
- Performance budget still treats critical fonts as one family per page

## Out of scope

- Latin-only baseline that breaks Arabic
- Loading every available weight/style on the critical path
