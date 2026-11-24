# Multi-Repository Astro Integration

## Common topology

```text
project-workspace/
├── project-docs/           # system source of truth
├── clt-project-site/       # Astro
├── clt-project-api/        # Laravel API
└── clt-project-cms/        # Laravel/Filament CMS, or combined with API
```

Each directory may remain a separate Git repository while Cursor opens the parent workspace when cross-repository analysis is needed.

## Ownership

Astro owns:

- public routes
- initial HTML and page composition
- SEO and locale routing
- static content rendering
- browser interactions
- frontend mappings and view models

Laravel/Filament owns:

- database schema and business records
- editorial workflow and permissions
- secure mutations
- API authorization
- media ownership and processing policy
- audit trails

## Contract rules

- Astro does not invent endpoints or CMS fields.
- Laravel does not change published response contracts silently.
- Every contract change updates system docs before both repos implement.
- Every shared feature has one Feature ID and separate repo issues.

## Documentation synchronization

System docs may be included through a multi-root workspace, managed copy, or approved sync process. Project-specific maps remain local and must not be overwritten by company standards sync.

## Cross-repo completion

A feature is not complete until:

- backend contract is implemented and tested
- Astro consumption is implemented and tested
- deployment/rebuild integration works
- content editors can manage required fields
- both repo docs and system docs are updated
