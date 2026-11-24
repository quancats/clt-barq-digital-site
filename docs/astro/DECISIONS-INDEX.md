# Decisions index

| Log                                                | Scope                                                                                           | ID namespace (new entries) |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------- |
| [docs/astro/DECISIONS.md](DECISIONS.md)            | Astro **template starter** decisions (maintainers)                                              | `TADR-####`                |
| [docs/system/DECISIONS.md](../system/DECISIONS.md) | **Adopting product** decisions; also holds bootstrap ADR-0001–ADR-0008 shipped with the starter | `ADR-####`                 |

## Namespace policy

- **Template maintainers:** New starter decisions use `TADR-####` in `docs/astro/DECISIONS.md`. Historical template entries keep their existing `ADR-0009`–`ADR-0021` numbers; do not renumber them.
- **Adopting projects:** Product decisions continue as `ADR-####` in `docs/system/DECISIONS.md`.
- See [TADR-0001](DECISIONS.md#tadr-0001--decision-namespace-node-24-and-ci-dist-artifact) for the namespace / Node / CI consistency record.
- See [TADR-0002](DECISIONS.md#tadr-0002--opt-in-analytics-default-build-time-site-url-loading-and-commandci-separation) for opt-in analytics default, `PUBLIC_SITE_URL`/`loadEnv`, and validate/build/verify separation.
- See [TADR-0003](DECISIONS.md#tadr-0003--tailwind-complete-ordinary-ui-minimize-pureraw-css) for Tailwind-complete ordinary UI and limited Pure/Raw CSS exceptions.
