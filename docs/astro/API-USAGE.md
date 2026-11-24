# API Usage

Baseline: **no first-party API usage**. Content Collections are local.

| Consumer  | Endpoint                                                  | Auth | When                                                                                                                                                      | Notes                                                                                                                                         |
| --------- | --------------------------------------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Analytics | `https://www.googletagmanager.com/gtag/js` (+ GA beacons) | none | Production builds with valid `PUBLIC_GOOGLE_ANALYTICS_ID`, enabled flag, and mode allowing load (`opt-in` only when `granted`; `opt-out` unless `denied`) | GA4 (`FEAT-PLATFORM-007` / TADR-0002); omit ID, set `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false`, or `PUBLIC_GOOGLE_ANALYTICS_MODE=off` to disable |

Future CMS/API consumption must be registered here after `docs/system/API-CONTRACTS.md` is updated.
