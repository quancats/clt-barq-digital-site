# MS-001 | Astro foundation

| Field                            | Value                                                            |
| -------------------------------- | ---------------------------------------------------------------- |
| Release and requirement          | v1.0, MS-001, REQ-001                                            |
| State                            | IN_REVIEW, local implementation and verification complete        |
| Owner                            | Website foundation engineer                                      |
| Dependencies                     | None                                                             |
| Repository and starting revision | `clt-barq-digital-site`, `release-v1.0/pr-sdfevnfj` at `3e5ade6` |
| Evidence date                    | 2026-11-25                                                       |

## Implementation

- WP-001.1 pins Node 24.15.0, pnpm 10.32.1, Astro 7.4.13 and Tailwind CSS 4.3.5. The single pnpm lockfile replaces the npm lockfile. Vite and the Vue ESLint parser are direct dependencies because project configurations import them. The existing manual CI definition uses the same lockfile and commands.
- WP-001.2 reuses the Astro static output, strictest TypeScript configuration and Tailwind Vite integration. The bilingual home renders Barq Digital copy in HTML. The manifest, browser icons and default social image use temporary project assets until brand approval.
- File groups: package manifest and lockfile, Node pin, local setup and CI commands, home and common dictionaries, site metadata and public assets, Playwright test and preview configuration.
- The inherited Vue navigation, component catalog and article fixtures stay available for compatibility and regression testing. Review these fixtures before production publication. The foundation introduces no new UI framework or server adapter.

## Acceptance evidence

| Check                                       | Result                                                                                                                                                                                       |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`            | Passed from an empty dependency directory                                                                                                                                                    |
| `pnpm run dev --host 127.0.0.1 --port 4381` | Background server served `/ar/` with HTTP 200 and the Arabic project heading. Status confirmed and server stopped                                                                            |
| `pnpm run validate`                         | Formatting, ESLint, Astro check and Vue type checking passed. Astro reported 0 errors and 0 warnings across 162 files. Vitest passed 64 tests across 17 files                                |
| `pnpm run build`                            | Local preview environment generated 12 static HTML pages                                                                                                                                     |
| `pnpm run verify`                           | Performance budgets, links and preview indexing policy passed. Chromium passed 64 tests, including Arabic RTL content and link navigation with JavaScript disabled                           |
| Repository and asset review                 | Only `.env.example` was tracked as an environment file. The focused search found no private key blocks or matching token patterns. Default template browser and sharing images were replaced |

No API, schema or external provider change was required. Hosted CI and production infrastructure were outside this verification. The handoff is for review of MS-001 and its existing-template compatibility decisions. MS-002 remains outside the implementation scope.
