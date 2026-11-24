# Project Issues Generator

## Purpose

This guide defines how to create GitHub/GitLab/ClickUp issues when starting a new project or rebuilding an existing one.

Issues must not be random tasks. They must be generated from the system docs.

## Required inputs

Before generating issues, read:

- `PROJECT-BRIEF.md`
- `PRODUCT-SCOPE.md`
- `SYSTEM-ARCHITECTURE.md`
- `APPLICATION-MAP.md`
- `DOMAIN-MAP.md`
- `DATA-OWNERSHIP.md`
- `FEATURE-REGISTRY.md`
- `API-CONTRACTS.md`
- `FLOW-MAP.md`
- `IMPLEMENTATION-PLAN.md`
- `PERMISSION-MATRIX.md`

## Issue hierarchy

Use:

```text
Epic / Milestone
→ Feature issue
→ Repository-specific implementation issues
→ Review / QA / release issues
```

## Issue types

- docs
- architecture
- backend
- nuxt
- astro
- frontend # legacy/generic label only when surface is not yet classified
- admin
- cms
- database
- api
- ux-ui
- devops
- testing
- review
- release

## Required issue fields

Every implementation issue should include:

- title
- repository
- application owner
- Feature ID
- milestone
- domain
- issue type
- priority
- dependencies
- scope
- out of scope
- acceptance criteria
- docs to update
- tests required
- risks

## Issue title format

The GitHub/GitLab issue **title is the human-readable issue name only**.

Do **not** put milestone IDs, Feature IDs, issue types, repository names, or priority into the title.

```text
Implement login API
```

Good examples:

```text
Implement login page
Implement home page
Complete system application map
```

Bad examples (do not use):

```text
[MS-001][FEAT-AUTH-001][backend] Implement login API
[MS-001][FEAT-AUTH-001][nuxt] Implement login page
[MS-001][FEAT-HOME-001][astro] Implement home page
[MS-000][docs] Complete system application map
[ASTRO] Implement home page
```

Put classification on the hosting platform instead:

| Concern | Where it belongs |
| ------- | ---------------- |
| Milestone (`MS-001`, …) | GitHub Milestone (and issue body / docs fields) |
| Feature ID (`FEAT-…`) | Issue body field + optional label if the org uses Feature labels |
| Type (`backend`, `astro`, `docs`, …) | GitHub Labels and/or GitHub Issue Types |
| Priority | GitHub Labels (or project field) |
| Repository / application | Issue body fields; multi-repo work stays as separate linked issues |

Issue body templates and generated `PROJECT-ISSUES.md` entries must still record Feature ID, milestone, type, domain, and repository explicitly even though those values are absent from the title.

## Multi-repository rule

If a feature touches backend and a web surface, create separate issues linked to the same Feature ID and milestone.

Do not create one vague issue called "Build auth".

## Start-of-project issue groups

### Group 0 — Documentation readiness

- project brief
- product scope
- application map
- domain map
- data ownership
- feature registry
- API contracts
- flow map
- implementation plan

### Group 1 — Foundation

- repository setup
- environment setup
- standards sync
- Cursor rules
- CI/testing baseline
- localization baseline
- auth foundation if in scope

### Group 2 — Feature milestones

Generate from `IMPLEMENTATION-PLAN.md`.

### Group 3 — Hardening

- audit
- tests
- docs sync
- performance
- security
- release checklist

## Output format for generated issues

Use Markdown sections grouped by milestone and repository.

## Android issue generation rules

When generating issues for Android:

- Create separate Android issues per Feature ID and milestone.
- Include API/SDK readiness status.
- Include fake-data decision.
- Include Material 3/design notes.
- Include security/local storage/offline requirements.
- Include required Android docs updates.
- Include tests expected.

Do not create implementation issues for Android features whose API/SDK contract is missing unless the issue is explicitly marked `Blocked` or `Mock Mode Approved`.

## iOS issue generation rules

When generating issues for iOS:

- Generate one iOS issue per Feature ID when the iOS app owns the feature.
- Each issue must include API/SDK readiness, design source, Apple-native implementation notes, security/privacy requirements, local data/cache decision, and App Store/privacy impact when relevant.
- Use `issues/templates/ios-issue-template.md`.

## Astro issue generation rules

When generating issues for Astro repositories:

- Include Page/Route IDs.
- Include content owner/source.
- Include rendering and hydration decision.
- Include locale and SEO requirements.
- Include accessibility, performance, and security requirements.
- Include API/CMS dependencies.
- Include tests and docs updates.

Use:

- `issues/templates/astro-project-issue-template.md`
- `issues/templates/astro-page-issue-template.md`
- `issues/templates/astro-cms-integration-issue-template.md`

Separate Laravel/Filament issues from Astro issues while linking the same Feature ID and milestone.

Informational pages, marketing sections, CMS content routes, and SEO-first public-site work use Astro issue templates, not Nuxt templates.

## Nuxt issue generation rules

Generate Nuxt issues only for application surfaces.

Every Nuxt feature issue includes:

- Feature ID, milestone, repository, and domain
- user/actor outcome
- routes/screens and application shell impact
- authentication, permission, and tenant/workspace impact
- API/SDK contract and backend dependency
- state owner and cache/invalidation behavior
- mutation, concurrency, retry, and error states
- responsive, i18n, RTL, accessibility, and theme impact
- test layers and documentation updates
- dependency or persistence approvals

Split by coherent user outcome or contract dependency, not by individual component/store/file. Create coordinated backend/mobile issues under the same Feature ID when required.

Do not generate an implementation issue that relies on unspecified APIs, fake production data, unapproved SDKs, or undefined permission behavior. Generate a readiness/contract issue first.

Use:

- `issues/templates/nuxt-feature-issue-template.md`
- `issues/templates/nuxt-api-integration-issue-template.md`
- `issues/templates/nuxt-auth-permission-issue-template.md`
- `issues/templates/nuxt-dashboard-table-issue-template.md`
- `issues/templates/nuxt-form-workflow-issue-template.md`
- `issues/templates/nuxt-realtime-issue-template.md`
- `issues/templates/nuxt-technical-debt-issue-template.md`

Review the generated issue set for dependency order, duplicate work, complete acceptance criteria, and an explicit release milestone.
