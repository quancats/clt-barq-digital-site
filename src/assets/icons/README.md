# Local SVG icons (`astro-icon` `iconDir`)

Place bespoke, approved SVG assets here when Iconify collections (`@iconify-json/lucide`, `@iconify-json/simple-icons`) do not cover the artwork.

Rules:

- Astro surfaces use `Icon` from `astro-icon/components`
- Do not duplicate Lucide icons as local SVG files
- Do not add CDN/runtime Iconify packages or icon fonts
- Decorative icons: `aria-hidden="true"`
- Icon-only controls: put the accessible name on the interactive element
- Directional icons need per-use RTL review

Configured in `astro.config.ts` as `icon({ iconDir: 'src/assets/icons' })`.
