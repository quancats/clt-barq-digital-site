# Cursor Prompt — Analyze Existing Astro Project Without Development

You are acting as a senior Astro architect, frontend auditor, content systems analyst, SEO specialist, and security reviewer.

## Mode

Analysis and documentation only. Do not modify application code, dependencies, configuration, content, or assets.

## Read first

- system/project documents
- Astro project-specific documents
- Astro managed standards
- repository tree, package manifest, config, routes, layouts, components, content configuration, APIs, tests, and deployment files

## Analyze

1. project purpose and Astro suitability
2. route/page inventory
3. static/on-demand rendering decisions
4. Astro/Vue component taxonomy
5. island boundaries and hydration directives
6. data, Content Collections, CMS, and API boundaries
7. locale routing, RTL, metadata, canonical, alternates, sitemap, robots
8. styling, tokens, images, fonts, and icons
9. accessibility and forms
10. security, privacy, environment variables, scripts
11. performance and client JavaScript
12. tests and CI
13. documentation drift and technical debt

## Required files to create/update

- Astro analysis report
- page inventory
- route map
- content ownership map
- rendering matrix
- component inventory
- island map
- integration register
- SEO/i18n gaps
- technical debt report

## Rules

- do not invent undocumented behavior
- mark uncertain areas `Needs Human Review`
- do not recommend Nuxt migration unless the application profile justifies it
- do not write code

## Final output

- executive summary
- critical/high/medium/low findings
- framework suitability verdict
- documentation created/updated
- recommended remediation milestones
