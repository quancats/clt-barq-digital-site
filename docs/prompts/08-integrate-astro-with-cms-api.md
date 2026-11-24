# Cursor Prompt — Integrate Astro with an Approved CMS/API

Preconditions:

- approved contract
- approved content ownership and freshness
- approved build/runtime mode
- approved environment and security behavior

Implement:

- server/build-safe client
- typed DTOs and runtime schemas
- mappers/view models
- named content queries
- locale/publication handling
- rich-text and media safety
- error/fallback behavior
- tests and docs

Do not expose secrets to client islands. Do not use raw API calls in pages/components. Do not fabricate fallback data for missing integrations.
