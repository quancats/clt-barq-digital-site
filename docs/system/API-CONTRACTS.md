# API Contracts

## Purpose

This file defines the contract between backend and frontend applications.

Frontend must not invent API shapes.
Backend must not change API shapes without updating this file.

## Baseline decision

This repository baseline is a static Astro site with **no HTTP API contracts**.

- No backend endpoints are owned or consumed by `site` in MS-001 / MS-002.
- Content is loaded from local Content Collections at build time.
- RSS and sitemap are generated static assets, not authenticated APIs.

If a future CMS or Laravel API is introduced, add endpoint contracts here before implementation and update `APPLICATION-MAP.md`, `DATA-OWNERSHIP.md`, and `docs/astro/API-USAGE.md`.

## Endpoint registry

| Requirement | Method | Path         | Owner app   | Consumers            | Verification         | Status                      |
| ----------- | ------ | ------------ | ----------- | -------------------- | -------------------- | --------------------------- |
| REQ-030     | POST   | `/api/leads` | Lead Worker | Four site lead forms | Turnstile Siteverify | Local implementation review |

## Lead intake

The same-origin request uses `Content-Type: application/json` and a body of up to 16 KiB. The four strict schemas reject extra fields. Every request includes `type`, `locale` (`ar` or `en`), `requestId` (UUID v4), `turnstileToken` (1–2,048 characters), `privacyAccepted: true`, `name` (2–120 characters), and `email` (up to 254 characters).

| Type           | Additional fields                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `general`      | `message`, optional `organization`                                                                        |
| `consultation` | `need`, approved `service` translation key (lowercase slug, up to 80 characters), optional `organization` |
| `demo`         | `organization`, `deploymentNeeds`, `userRange` (`1-50`, `51-200`, `201-1000`, or `1001+`)                 |
| `partnership`  | `organization`, `proposal`, `partnershipType` (`technology`, `commercial`, `delivery`, or `other`)        |

Organization is 2–160 characters when supplied. The message, need, deployment needs and proposal fields each accept 10–2,000 characters. Text fields are trimmed at the Worker. Attachments are outside this contract.

Success is HTTP 202 and `{ "ok": true, "correlationId": "…" }` after upstream acceptance. Failure returns `{ "ok": false, "correlationId": "…", "code": "…" }`. Validation errors may add `fieldErrors` with top-level field names. The UI localizes these keys.

| HTTP | Codes                                                             |
| ---- | ----------------------------------------------------------------- |
| 400  | `invalid_input`                                                   |
| 403  | `origin_forbidden`, `bot_rejected`                                |
| 404  | `not_found`                                                       |
| 405  | `method_not_allowed`, with `Allow: POST`                          |
| 409  | `duplicate`                                                       |
| 413  | `payload_too_large`                                               |
| 415  | `unsupported_media_type`                                          |
| 429  | `rate_limited`, with `Retry-After: 60`                            |
| 503  | `unavailable`, `verification_unavailable`, `provider_unavailable` |

The Worker's API response carries no-store JSON and restrictive security headers. Application logs contain a generated correlation ID and an outcome code. Hosting log settings require separate review before provider testing.

### Runtime and provider boundary

- Set `LEAD_ALLOWED_ORIGIN` to the one exact origin served by the environment and `LEAD_ALLOWED_SERVICES` to the comma-separated approved consultation keys. Store `TURNSTILE_SECRET_KEY` in Worker secrets. Siteverify requires the request hostname and action `lead`. Keep test and live settings isolated.
- `LEAD_RATE_LIMIT` is a Cloudflare per-location rate-limit binding keyed by a hash of the Cloudflare client address. `LEAD_REPLAY_LIMIT` is a second binding keyed by the request ID and separately by the proof hash. The local profile proposes 12 submissions per minute per client address and one use of each replay key per minute. Cloudflare counters are approximate. Siteverify redemption is also eventually consistent. [Cloudflare Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) and [Cloudflare Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
- `LEAD_DELIVERY` is a private service binding. Its adapter accepts `POST https://lead-delivery.internal/leads` and normalized lead fields. The Worker removes the raw challenge token and sends `Idempotency-Key`, `X-Lead-Proof-Key` (opaque hash), and `X-Correlation-ID` privately to the adapter. The adapter contract requires checking both deduplication keys before a send and using a stable idempotency key through provider acceptance. The adapter returns 202 for an accepted submission and 409 for a duplicate. The binding is absent from the local profile. The Worker times out delivery after eight seconds and sends no automatic provider retries. A timeout can leave upstream delivery uncertain.
- Selecting the provider and adapter, verifying their deduplication and recipient routing, approving sender, retention and data location, provisioning sandbox credentials, and recording four controlled receipts remain pending. The current runtime uses no provider credentials, persistence, or test delivery adapter.

Use the explicitly local Wrangler profile to exercise API routing and static assets after building `dist/`. Configure only a controlled origin and sandbox bindings. Preview and live provider acceptance remain subject to the MS-031 approval and evidence gates.
