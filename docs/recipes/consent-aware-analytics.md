# Recipe: Consent-aware analytics

## Entry conditions

- Baseline ships CookieConsent + mode-aware `Analytics` (ADR-0014, superseded default by TADR-0002) when analytics is enabled and `PUBLIC_GOOGLE_ANALYTICS_MODE` is not `off`
- Default mode is **opt-in** (GA must not load until stored preference is `granted`). Prefer this over calling older docs that still say opt-out is default
- Legal/contractual need requires Consent Mode v2 defaults, a Privacy Policy link, or a deliberate return to honest `opt-out`

## Goals

- Keep baseline CookieConsent + footer privacy settings (`data-privacy-settings`)
- First-visit banner auto-opens only when a production-valid Measurement ID can load; privacy settings remain available when analytics is enabled even if the ID is temporarily unset
- Optionally emit Consent Mode v2 defaults if legal scope requires stricter signaling
- Link preference UI to a Privacy Policy page once it exists
- Provide withdraw / revisit paths (footer privacy settings already reopens CookieConsent)

## Suggested approach

1. Keep baseline `CookieConsent.astro` + `Analytics.astro` unless the project needs a different UX
2. Customize bilingual copy under `src/i18n/dictionaries/*/common.ts` (`cookie_consent.*`)
3. Keep `PUBLIC_GOOGLE_ANALYTICS_MODE=opt-in` unless counsel explicitly accepts pre-choice loading via `opt-out`
4. Optionally emit Consent Mode v2 defaults if required by counsel
5. Add Privacy Policy route + footer link (see marketing/org recipe)
6. Document withdraw behavior: store versioned JSON `{ "state": "denied", "version": 1 }` at `localStorage` key `analytics-consent` (or use the UI) and reload
7. Custom conversion events: see [analytics-events-allowlist.md](analytics-events-allowlist.md)

## Env

| Variable                          | Notes                                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_GOOGLE_ANALYTICS_ID`      | Required for GA injection; without it the banner does not auto-open                                               |
| `PUBLIC_GOOGLE_ANALYTICS_ENABLED` | Keep `true` unless globally disabling GA and preference UI                                                        |
| `PUBLIC_GOOGLE_ANALYTICS_MODE`    | `off` \| `opt-out` \| `opt-in` (default **opt-in**). Prefer this over removed `PUBLIC_ANALYTICS_CONSENT_REQUIRED` |

## Acceptance checks

- Mode `opt-in` (default): configured GA loads only after `granted`
- Mode `opt-out`: configured GA may load when preference is unset or granted; may load before first choice
- Reject → versioned `denied` persisted and scripts absent after reload; already-sent pageviews are not retracted
- Stored denial remains honored even if preference UI is hidden later
- Footer privacy settings reopens CookieConsent when analytics is enabled and mode is not `off`
- Escape closes the dialog; focus returns sanely
- Keyboard, focus, `dir`, and reduced-motion coverage
- No PII in preference storage keys/values

## Baseline status

- CookieConsent banner + analytics modes + footer privacy settings: **implemented in the shared template**
- Consent Mode v2 defaults, Privacy Policy wiring, and advanced legal copy: **adopting-project extensions**
- Partytown or analytics npm SDKs: still out of scope

## Advanced Consent Mode (explicit adoption)

The shared template uses `opt-in` by default. Adopt this example only after deciding to allow the Google tag to load while analytics storage is denied. Advanced Consent Mode can send cookieless signals before consent. Keep advertisement storage, user data and personalization denied on every command. Review the provider and privacy terms for the project. [Google Consent Mode setup](https://developers.google.com/tag-platform/security/guides/consent)

In the adopting project, use this module with the existing measurement ID validation and enable flag. Replace the default loader and the accept/reject listeners for this mode only. Call it once before any tag config or analytics event. Pass `localStorage` through a getter so blocked access is caught. Connect the two existing buttons to the returned function with `true` or `false`; the change takes effect on the current page even if the preference cannot persist.

```js
export function startAdvancedConsent({ gtag, loadTag, getStorage, measurementId }) {
	const key = 'analytics-consent';
	const consent = (analytics_storage) => ({
		analytics_storage,
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
	});

	gtag('consent', 'default', consent('denied'));
	try {
		const raw = getStorage().getItem(key);
		const saved = raw === 'granted' ? { version: 1, state: raw } : JSON.parse(raw);
		if (saved?.version === 1 && saved.state === 'granted') {
			gtag('consent', 'update', consent('granted'));
		}
	} catch {
		// Unavailable or invalid storage leaves the denied defaults in effect.
	}
	gtag('js', new Date());
	gtag('config', measurementId);
	loadTag(measurementId);

	return (accepted) => {
		const state = accepted ? 'granted' : 'denied';
		gtag('consent', 'update', consent(state));
		try {
			getStorage().setItem(key, JSON.stringify({ version: 1, state }));
		} catch {
			// Consent already took effect for this page.
		}
	};
}
```

Initialize the global `dataLayer` and a `gtag` queue function (`function gtag() { window.dataLayer.push(arguments); }`) before calling the module. `loadTag` appends one async script for the validated ID. Verify the first command is denied by default, a stored grant precedes config, and the accept and withdrawal commands still apply in order with blocked storage. Check that the three ad permissions remain denied throughout. Use a test tag or intercept the request during local verification.

## Adoption ownership

Record the owner, analytics destination, classified consent purpose and tag behavior for each grant or denial. Test denied, granted and withdrawn states with an intercepted or test tag. Record the live tag and provider acceptance in the adopting project.
