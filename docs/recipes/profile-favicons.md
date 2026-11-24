# Recipe: Profile favicons

## Entry conditions

- You need generated favicon / apple-touch / web manifest icons from a source image.
- Baseline already ships static files under `public/` — replace them deliberately.

## Goals

- Separate **experimentation** (ignored previews) from **generation** (tracked `public/` output).
- Declare image tooling explicitly (do not rely on transitive `sharp`).

## Command layers

Add only after an Integrations proposal:

```json
{
	"scripts": {
		"experiment:favicons": "node scripts/generate-favicons.mjs --out .tmp/favicon-preview",
		"generate:favicons": "node scripts/generate-favicons.mjs --out public"
	}
}
```

- `experiment:favicons` writes under an ignored path (for example `.tmp/`) and must not overwrite tracked assets.
- `generate:favicons` writes deterministic tracked files when intentionally promoted.

## Typical preferred outputs (when generating)

Aim for a replaceable set that matches baseline `BaseHead` links:

- `public/favicon.svg`
- `public/favicon.ico`
- `public/favicon-16x16.png` / `public/favicon-32x32.png` (optional sized PNGs if you extend BaseHead)
- `public/apple-touch-icon.png` (180×180)
- `public/android-chrome-192x192.png` / `512x512` (optional; update `manifest.webmanifest`)
- `public/manifest.webmanifest` (update icons array if needed)

Baseline `BaseHead` currently links SVG + ICO + apple-touch + manifest. Add sized PNG `<link>` tags only when those files are promoted.

## Acceptance checks

- `sharp` (or chosen encoder) is a direct dependency of the adopting project
- Experimentation does not dirty tracked `public/` files
- Generation is deterministic for the same source + options
- Dimensions/formats validated
- `npm run build` still passes link/head checks

## Out of scope

- Personal portrait favicons as a template default
- Adding favicon generation scripts to the shared starter without product need
