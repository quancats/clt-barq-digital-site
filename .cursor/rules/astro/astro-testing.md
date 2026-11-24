# Cursor Rule — Astro Testing

## Required validation

Provide project-equivalent commands for:

- `astro check`
- lint
- format check
- Vitest
- production build
- Vue type checking when Vue exists
- Playwright for required browser flows

## Test ownership

- unit tests: helpers, schemas, mappers, SEO, locale logic
- integration tests: content/component contracts
- E2E: routes, locales, navigation, forms, islands, keyboard/focus, SEO-critical output

## Rules

Test important behavior and failure paths. Use semantic locators and stable fixtures. Do not use arbitrary sleeps. Do not accept runtime fake data as an integration replacement.

## Release blocking

Type errors, content-schema failure, build failure, required-test failure, critical accessibility regressions, or missing expected routes block completion.
