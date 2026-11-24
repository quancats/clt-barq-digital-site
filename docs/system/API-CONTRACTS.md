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

## Global response rules

Not applicable in baseline. Future APIs must define:

- success response envelope
- validation error format
- authorization error format
- not found error format
- conflict error format
- rate limit format
- pagination format
- date/time format
- localization of messages

## Endpoint registry

| Feature ID | Method | Path | Owner app | Consumers | Auth | Status           |
| ---------- | ------ | ---- | --------- | --------- | ---- | ---------------- |
| —          | —      | —    | —         | —         | —    | None in baseline |
