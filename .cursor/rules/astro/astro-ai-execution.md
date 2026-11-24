# Cursor Rule — Astro AI Execution

## Explicit mode

Operate only in the requested mode: analyze, plan, scaffold, implement, fix, refactor, review, update-docs, generate-issues, or commit.

## Pre-edit behavior

Inspect standards, project maps, neighboring code, integrations, package manager, tests, and current conventions. Verify readiness and scope. Do not assume Vue, shadcn-vue, Reka UI, an adapter, Actions, or runtime rendering is already installed.

## Implementation behavior

- implement the complete approved scope
- do not exceed the milestone
- do not fabricate content or integration data
- use Astro-first patterns and the least aggressive Client Directive
- place work in `components/astro`, `components/ui`, `components/islands`, or `components/patterns`
- preserve valid local conventions
- add states, locales, SEO, accessibility, tests, and documentation
- do not add unapproved dependencies
- do not install Nuxt UI or React for Astro UI work
- do not rebuild Dialog, Dropdown, or focus-trap primitives when shadcn-vue/Reka UI fits

## Conflict behavior

When task instructions conflict with project or standards, identify the conflict and required decision. Do not silently invent a third pattern.

## Completion

Report files, taxonomy classification, Client Directive justification when Hydration is used, validation, documentation, risks, and follow-ups unless code-only output was explicitly requested.
