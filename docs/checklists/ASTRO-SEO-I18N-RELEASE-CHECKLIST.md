# Astro SEO and I18n Release Checklist

- [ ] Every active locale route exists.
- [ ] lang/dir are correct.
- [ ] Locale font family matches `lang` (Tajawal for `ar`, Manrope for `en` unless overridden).
- [ ] Public URLs keep a trailing slash when `trailingSlash: 'always'` is the project policy.
- [ ] Titles/descriptions are localized.
- [ ] Canonicals are locale-correct.
- [ ] Alternates are reciprocal.
- [ ] Language switch resolves translated equivalents.
- [ ] OG and structured data are accurate.
- [ ] Sitemap and robots are correct.
- [ ] Staging/preview are non-indexable.
- [ ] No visible hardcoded language or accidental fallback remains.
