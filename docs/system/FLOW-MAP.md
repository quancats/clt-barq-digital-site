# Flow Map

## Purpose

Document user and system flows for the **adopting project** before implementation.

> **Template maintainers:** Current starter UX behavior is documented in `docs/astro/` maps (`SCREEN-MAP`, `ISLAND-MAP`, `I18N-MAP`). Do not append template-only flows here.

## Flow registry

| Flow ID          | Flow                             | Actors       | Related features  | Related apps | Status      |
| ---------------- | -------------------------------- | ------------ | ----------------- | ------------ | ----------- |
| FLOW-LOCALE-001  | Locale entry and language switch | Site visitor | FEAT-PLATFORM-001 | site         | Implemented |
| FLOW-NAV-001     | Primary navigation               | Site visitor | FEAT-PLATFORM-001 | site         | Implemented |
| FLOW-CONTENT-001 | Browse and read articles         | Site visitor | FEAT-CONTENT-001  | site         | Implemented |
| FLOW-THEME-001   | Select and resolve color theme   | Site visitor | FEAT-PLATFORM-001 | site         | Implemented |
| FLOW-UI-001      | Browse component catalog demos   | Site visitor | FEAT-PLATFORM-002 | site         | Implemented |

## Flows

### FLOW-LOCALE-001 — Locale entry and language switch

Actors: Site visitor

Preconditions: Site is built and deployed/served locally

Main path:

1. Visitor opens `/`
2. Site redirects to default locale home `/ar/`
3. Visitor uses language switcher link
4. Site navigates to the translated equivalent route when available, otherwise locale home

Alternative paths:

- Direct entry to `/en/` or a localized article URL

Failure paths:

- Missing translation falls back to locale home per policy
- Unknown routes render localized 404

Related features: FEAT-PLATFORM-001, FEAT-CONTENT-001

Related domains: LocaleSeo

Related data: ui_dictionaries, articles

Related APIs: None

Related UI screens: Header language switcher, home, articles

Audit/logging: None

Security considerations: Language switcher uses real links, not JS-only buttons

Open questions: None

### FLOW-NAV-001 — Primary navigation

Actors: Site visitor

Preconditions: Locale resolved

Main path:

1. Visitor uses header links for Home and Articles
2. Site serves static localized routes

Alternative paths: Footer links mirror primary destinations

Failure paths: Broken internal links fail e2e/CI

Related features: FEAT-PLATFORM-001

Related domains: Platform

Related data: ui_dictionaries

Related APIs: None

Related UI screens: Header, footer

Audit/logging: None

Security considerations: None beyond ordinary public HTML

Open questions: None

### FLOW-CONTENT-001 — Browse and read articles

Actors: Site visitor, Content author

Preconditions: Published article entries exist for the locale

Main path:

1. Visitor opens localized articles index
2. Visitor selects an article card
3. Site renders article detail from Content Collection HTML
4. Visitor may switch language to the translation group equivalent

Alternative paths:

- Home page shows latest published articles teaser

Failure paths:

- Drafts never appear publicly
- Missing slug returns 404
- Invalid frontmatter fails build

Related features: FEAT-CONTENT-001

Related domains: Content, LocaleSeo

Related data: articles

Related APIs: None

Related UI screens: Articles index, article detail

Audit/logging: Git history for content changes

Security considerations: Only trusted repository Markdown/MDX is rendered; MDX imports are checked against the allowlist in CI

Open questions: None

### FLOW-THEME-001 — Select and resolve color theme

Actors: Site visitor

Preconditions: A localized page is rendered

Main path:

1. The pre-paint script reads the stored mode or configured `PUBLIC_DEFAULT_THEME`
2. `auto` resolves from `prefers-color-scheme`; `light` and `dark` resolve directly
3. The resolved class is applied to `<html>` before visible content
4. The visitor may choose light, dark, or auto from the header
5. The selected mode is persisted in `localStorage` under `site-theme`

Alternative paths: If storage is unavailable, the configured default remains active.

Failure paths: Invalid stored values fall back to the configured default.

Related features: FEAT-PLATFORM-001

Related domains: Platform, LocaleSeo

Related data: site_config, ui_dictionaries

Related APIs: Browser `localStorage` and `matchMedia` only

Related UI screens: All public pages through `BaseLayout` and `ThemeSwitcher`

Audit/logging: None; theme preference is local and non-sensitive

Security considerations: No preference is sent to a server or third party

Open questions: None

### FLOW-UI-001 — Browse component catalog demos

Actors: Site visitor, Engineer

Preconditions: Catalog routes are built and Vue island assets are available

Main path:

1. Visitor opens `/ar/components/` or `/en/components/` from the header
2. Page renders static catalog shell and hydrates the catalog island at idle
3. Visitor interacts with representative demos (accordion, dialog, form fields, carousel, toast)
4. Visitor may switch language and remain on the translated catalog route

Alternative paths:

- Direct entry from sitemap or shared URL

Failure paths:

- Invalid demo state remains local-only; no network mutation occurs

Related features: FEAT-PLATFORM-002

Related domains: Platform, LocaleSeo

Related data: ui_dictionaries, ui_component_registry

Related APIs: None

Related UI screens: Components catalog, SiteHeader

Audit/logging: None

Security considerations: Demo forms must not submit to a server endpoint

Open questions: None
