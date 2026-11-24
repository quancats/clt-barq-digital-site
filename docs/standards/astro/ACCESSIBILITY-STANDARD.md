# Astro Accessibility Standard

## Principle

Accessibility is an architectural and release requirement, not visual polish.

## Required baseline

- semantic landmarks and elements
- logical heading hierarchy
- skip navigation
- keyboard operation
- visible focus
- accessible names
- associated form labels/help/errors
- meaningful image alternatives
- reduced-motion support
- adequate contrast
- zoom and large-text resilience
- direction-aware interaction in RTL/LTR

## Static content

Keep primary navigation, headings, article body, service content, and core calls to action in initial HTML.

## Islands

Each island must define:

- keyboard behavior
- focus entry and restoration
- error/status announcements
- behavior before hydration
- accessible fallback if the script fails

## Testing

Use semantic Playwright locators, keyboard journeys, browser focus review, and approved automated checks. Automated scans do not replace manual validation.

## Release blockers

- inaccessible primary navigation
- keyboard traps
- unlabeled required form controls
- missing visible focus
- critical content available only after client rendering without accessible fallback
