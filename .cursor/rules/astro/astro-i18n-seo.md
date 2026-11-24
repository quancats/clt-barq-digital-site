# Cursor Rule — Astro Internationalization and SEO

## Locale quality

All active locales are release targets. Do not create one-locale pages or visible hardcoded strings without an approved exception.

## Document requirements

Set `lang` and `dir` at the root. Use logical/direction-aware styling and test Arabic/English mixed content. For bilingual baselines, apply locale-paired fonts (Tajawal for `ar`, Manrope for `en`) and selectively preload weight 400 + locale subset for the active family only.

## Route requirements

Every indexable route requires localized title, description, canonical, Open Graph values, robots intent, and valid alternate-language links where translations exist.

## Content requirements

SEO-critical content must be present in Server-rendered HTML. Do not render hero text, primary navigation, FAQ content, article body, or core page copy only after Hydration. Do not use a Carousel to hide essential content.

Pass `locale` and `dir` clearly into Vue Islands. Keep translatable text out of shared UI Primitives. Forms and validation messages must use the translation system.

## Safety

Do not invent claims, prices, ratings, addresses, authorship, or structured-data facts. Metadata must reflect visible approved content.
