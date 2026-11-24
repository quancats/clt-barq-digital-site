# Cursor Prompt — Analyze Astro Site and Propose Laravel/Filament CMS Model

## Mode

Analysis and documentation only. Do not create migrations, models, resources, APIs, or frontend code.

## Objective

Analyze an existing Astro informational website and produce a candidate content/database model for a Laravel + Filament CMS.

## Analyze

- routes and localized equivalents
- static dictionaries and content collections
- repeated sections and data shapes
- page-owned versus reusable content
- nested blocks and ordering
- articles/services/projects/team/testimonials/FAQs/legal/contact content
- media and alt/focal/crop needs
- SEO and social metadata
- publication, draft, review, scheduling, archival
- locale and translation identity
- global settings/navigation/footer
- forms and leads

## Candidate design must document

- entity/table candidate
- domain and application owner
- business/editorial reason
- fields and localized fields
- relationships
- indexes and unique constraints
- lifecycle/status
- audit and soft-delete needs
- nested/relation manager behavior in Filament
- proposed public API read model
- content that should stay static
- uncertainty and human decisions

## Rules

- visual repetition does not automatically mean a table
- do not create one generic JSON page blob by default
- do not over-normalize page-only content without editorial value
- do not implement code

## Output

- reverse content inventory
- candidate CMS model
- candidate database map
- Filament resource/nested resource map
- API contract candidates
- migration milestones
- risks and human review questions
