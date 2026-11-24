# Technical Debt

## Purpose

Track known issues that should not be hidden inside chats or PR comments.

## Debt registry

| ID     | Area          | Severity | Description                                                                                                                                                           | Related Feature   | Suggested milestone       | Status |
| ------ | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------- | ------ |
| TD-001 | Documentation | Medium   | Duplicate managed docs trees (`docs/standards` vs `docs/01-standards`, `docs/checklists` vs `docs/03-checklists`, governance mirrors) create canonical-path ambiguity | FEAT-PLATFORM-001 | Standards package cleanup | Open   |
| TD-002 | i18n config   | Low      | Cloudflare Workers owns the root redirect; the build emits the rule from the configured default locale.                                                               | FEAT-PLATFORM-001 | Template 1.2.0            | Closed |
| TD-003 | A11y / UI     | Low      | Catalog and open dialog pass axe color contrast in light and dark, LTR and RTL.                                                                                       | FEAT-PLATFORM-002 | Template 1.2.0            | Closed |

## Debt item template

### TD-001 — Duplicate managed documentation trees

Area: Documentation packaging

Severity: Medium

Description: The repository contains mirrored standards/checklist/governance paths. Structure standards also mention a nested `docs/standards/astro/01-standards/` path that does not match the flat layout.

Why it matters: Engineers and agents may edit or cite the wrong copy.

Related files:

- `docs/standards/`
- `docs/01-standards/`
- `docs/checklists/`
- `docs/03-checklists/`
- `docs/governance/`
- `docs/00-governance/`

Related features: FEAT-PLATFORM-001

Recommended fix: Resolve canonical paths in the central standards package and sync one tree into project templates. Do not delete mirrors ad hoc in feature PRs without package ownership.

Risk if ignored: Conflicting guidance and accidental local edits to managed standards

Status: Open

### TD-002 — Manual root locale redirect

Resolved in 1.2.0. Cloudflare Workers serves an HTTP redirect from the generated `_redirects`; Astro no longer generates a root HTML page. See the [routing recipe](../recipes/routing-and-host-redirects.md).

### TD-003 — Catalog color-contrast exemption

Resolved in 1.2.0. The catalog runs axe with color contrast enabled on both themes and locales. Adjusted the destructive palette, active step text and footer link.
