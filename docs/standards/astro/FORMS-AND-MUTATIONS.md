# Astro Forms and Mutations Standard

## Ownership decision

Before implementation, identify who owns the mutation:

- Laravel/backend API
- Astro Action or endpoint
- approved hosting form service

Do not duplicate an existing Laravel business workflow inside Astro.

## Static-site default

A static Astro page posts to an approved backend endpoint owned by the adopting project. The form remains semantic and usable with progressive enhancement when practical.

Preferred interaction ladder:

1. native HTML form
2. progressive enhancement
3. Vue island only when complexity justifies it

Do not ship a production contact form, endpoint URL, honeypot secrets, or legal privacy copy inside a shared starter without project ownership, Feature ID, and security controls. Starter templates may document the ladder as a recipe (`docs/recipes/contact-form.md`) without installing backend dependencies.

## Astro server option

Astro Actions or endpoints require an approved adapter and server output for the relevant route/runtime. They are appropriate only when Astro intentionally owns the server boundary.

## Interaction choice

Use native HTML Form and Astro for simple submissions that do not need immediate or complex Client Validation.

Use a Vue Island when the form needs conditional fields, multi-step flow, dependent selects, file previews, dynamic arrays, autosave, rich feedback, or complex submission state. The approved stack is:

```text
Zod
+ vee-validate when needed
+ shadcn-vue Form UI Primitives
```

Shared form schemas belong in `src/lib/validation`. Server Validation remains mandatory and is the source of truth. Associate Label, Description, and Error with each input. Translate validation messages.

## Required states

- initial
- client validation where useful
- server validation
- pending
- success
- recoverable error
- duplicate submission prevention

## Security

- validate server-side
- minimize data
- control abuse
- do not expose credentials
- never send secrets to Client Code or Vue Islands
- avoid personal data in logs/analytics
- document retention and deletion expectations
