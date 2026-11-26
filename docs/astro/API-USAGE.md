# API Usage

Content Collections are local. Site forms use a same-origin lead intake endpoint.

| Consumer   | Endpoint                                                  | Auth                      | When                                                                                                                                                      | Notes                                                                                                                                         |
| ---------- | --------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Analytics  | `https://www.googletagmanager.com/gtag/js` (+ GA beacons) | none                      | Production builds with valid `PUBLIC_GOOGLE_ANALYTICS_ID`, enabled flag, and mode allowing load (`opt-in` only when `granted`; `opt-out` unless `denied`) | GA4 (`FEAT-PLATFORM-007` / TADR-0002); omit ID, set `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false`, or `PUBLIC_GOOGLE_ANALYTICS_MODE=off` to disable |
| Site forms | `POST /api/leads`                                         | Server-verified Turnstile | General, consultation, demo and partnership submissions                                                                                                   | [Lead intake contract](../system/API-CONTRACTS.md#lead-intake)                                                                                |

Future CMS/API consumption must be registered here after `docs/system/API-CONTRACTS.md` is updated.
