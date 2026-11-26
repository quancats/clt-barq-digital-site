# MS-002 | Architecture and engineering conventions

| Field                 | Evidence                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Release / requirement | v1.0 / REQ-002                                                                                      |
| Owner                 | Barq Digital website technical lead                                                                 |
| Starting checkout     | `release-v1.0/pr-sdfevnfj` at `9af8729`                                                             |
| Date                  | 2026-11-25                                                                                          |
| Dependency            | [MS-001 local evidence](MS-001-foundation.md) is available. The user accepted MS-001 on 2026-11-25. |
| State                 | ACCEPTED by the user on 2026-11-25.                                                                 |

## WP-002.1 architecture decisions

[ADR-0009 and ADR-0010](DECISIONS.md#adr-0009--keep-the-barq-digital-website-static-in-one-repository) establish the application and content boundaries. The [system architecture](SYSTEM-ARCHITECTURE.md) maps them to existing directories and identifies the planned deployment and localization contracts.

Review used `astro.config.ts`, `src/content.config.ts`, `src/i18n/config.ts`, `src/data/hostRedirects.mjs`, the source tree, `package.json`, `pnpm-lock.yaml` and the MS-001 evidence. The current configuration declares static output and an explicit list of integrations. The project pins Node 24.15.0, pnpm 10.32.1, Astro 7.4.13, Tailwind 4.3.5 and Vite 8.3.8. TypeScript strictest, ESLint and Prettier cover source quality. Vitest covers unit and integration behavior. Playwright and axe cover browser behavior and accessibility checks. Vue, Reka UI, MDX, icons, RSS and sitemap are inherited dependencies whose purpose follows the [starter dependency register](../astro/DEPENDENCY-REGISTER.md) and [project pnpm override](../standards-overrides/PROJECT-OVERRIDES.md). The manifest and lockfile govern the actual installed set.

References reviewed include the Astro guides for [routing](https://docs.astro.build/en/guides/routing/), [components](https://docs.astro.build/en/basics/astro-components/), [framework components](https://docs.astro.build/en/guides/framework-components/), [content collections](https://docs.astro.build/en/guides/content-collections/), [styling](https://docs.astro.build/en/guides/styling/) and [internationalization](https://docs.astro.build/en/guides/internationalization/).

## WP-002.2 engineering and review conventions

- The checkout has `origin/dev`, `origin/master` and `origin/release-v1.0/pr-sdfevnfj`. GitHub identifies `dev` as the default of `quancats/clt-barq-digital-site`. Use `dev` for integration and `master` for reviewed release changes. On 2026-11-25, GitHub returned `protected: false` and no active rules for both branches. Treat this as a gap in automated enforcement. An owner with repository administration can apply the intended protection when authorized. The milestone's technical review can assess the documented conventions independently of settings changes.
- Keep a PR focused on one coherent issue or milestone scope. Reference the verified relevant open issue, existing Feature ID when assigned, milestone, affected domain/application, checks and documentation. Include risks and screenshots where called for. Review before committing and use atomic Conventional Commits linked to the verified open issue. Follow the [Git workflow](../standards/git/GIT-WORKFLOW.md), [PR guide](../standards/git/PR-GUIDE.md) and [Astro review checklist](../checklists/ASTRO-PR-REVIEW-CHECKLIST.md).
- Assign a single writer per shared contract while work runs in parallel. The technical lead coordinates the Astro config, dependency manifest and lockfile, content schema, i18n, global styles, navigation, redirects, API contract and deployment config. Assign other contributors disjoint page, content or documentation paths.
- For contract changes, record the affected callers, backward compatibility, approval, owner and validation in the issue and relevant ADR, API contract or schema documentation. Land the base contract before dependent changes. Reconcile branch work against the accepted base before integration. Keep working-tree changes isolated and avoid empty folders or premature service scaffolds.
- Respect [AGENTS.md](../../AGENTS.md). Start development with `pnpm run dev`, which uses background mode. Use `pnpm astro dev status`, `pnpm astro dev logs` and `pnpm astro dev stop` for the background dev process.

| Local command                    | What it checks                                       |
| -------------------------------- | ---------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Reproducible dependency installation                 |
| `pnpm run validate`              | Formatting, lint, Astro and Vue types, Vitest        |
| `pnpm run build`                 | Static build and generated artifacts                 |
| `pnpm run verify`                | Artifact budgets, internal links, SEO and Playwright |
| `pnpm run ci:local`              | Validation, build and verification in sequence       |

MS-006 configures the repository workflow for manual dispatch and pull requests to `dev` and `master`. The hosted run remains unverified. GitHub issues [#20](https://github.com/quancats/clt-barq-digital-site/issues/20) and [#21](https://github.com/quancats/clt-barq-digital-site/issues/21) for MS-001 and [#22](https://github.com/quancats/clt-barq-digital-site/issues/22) and [#23](https://github.com/quancats/clt-barq-digital-site/issues/23) for MS-002 were open with no recorded review comments. The current branch had no PR in the project repository. The user accepted MS-001 and MS-002 in the execution conversation on 2026-11-25. MS-003 has since been accepted. MS-004 and MS-005 use these architecture boundaries.
