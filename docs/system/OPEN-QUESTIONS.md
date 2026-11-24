# Open Questions

## Purpose

Capture unknowns that must not be silently guessed during implementation.

## Open questions

| ID    | Question                                                                                                                   | Area          | Blocking?                    | Owner                         | Status              |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------- | ----------------------------- | ------------------- |
| Q-001 | Which docs path is canonical for managed standards copies (`docs/standards` vs `docs/01-standards`, checklists similarly)? | Documentation | No for baseline code         | Standards package maintainers | Open                |
| Q-002 | What production `SITE_URL` and host should adopters use?                                                                   | Deployment    | Yes at real project adoption | Adopting project owner        | Open until adoption |

## Resolved for baseline

| ID              | Decision                                         |
| --------------- | ------------------------------------------------ |
| Locales         | `ar`/`en`, default `ar`, prefix all              |
| Rendering       | Static only                                      |
| Content source  | Local Markdown + trusted MDX Content Collections |
| Vue/CMS/adapter | Out of baseline                                  |
