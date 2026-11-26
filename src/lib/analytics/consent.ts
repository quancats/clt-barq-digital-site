/** localStorage key for non-PII analytics preference (versioned JSON). */
export const ANALYTICS_CONSENT_STORAGE_KEY = 'analytics-consent';

/** Current preference schema version. Outdated or malformed values are treated as unset. */
export const ANALYTICS_CONSENT_VERSION = 1;

export type AnalyticsMode = 'off' | 'opt-out' | 'opt-in';

export type AnalyticsPreferenceState = 'granted' | 'denied';

export interface AnalyticsPreference {
	state: AnalyticsPreferenceState;
	version: number;
}

const VALID_MODES = new Set<AnalyticsMode>(['off', 'opt-out', 'opt-in']);

/**
 * Parses `PUBLIC_GOOGLE_ANALYTICS_MODE`. Invalid or empty values fall back to `opt-in`.
 */
export function parseAnalyticsMode(value: string | undefined | null): AnalyticsMode {
	if (value == null || value === '') {
		return 'opt-in';
	}

	const normalized = String(value).trim().toLowerCase();
	if (VALID_MODES.has(normalized as AnalyticsMode)) {
		return normalized as AnalyticsMode;
	}

	return 'opt-in';
}

/**
 * Parses stored preference. Supports versioned JSON and legacy plain `granted`/`denied` strings.
 * Unknown, malformed, or outdated values are treated as unset.
 */
export function parseAnalyticsPreference(raw: string | null | undefined): AnalyticsPreference | null {
	if (raw == null || raw === '') {
		return null;
	}

	if (raw === 'granted' || raw === 'denied') {
		return { state: raw, version: ANALYTICS_CONSENT_VERSION };
	}

	try {
		const parsed = JSON.parse(raw) as Partial<AnalyticsPreference>;
		if ((parsed.state === 'granted' || parsed.state === 'denied') && typeof parsed.version === 'number' && parsed.version === ANALYTICS_CONSENT_VERSION) {
			return { state: parsed.state, version: parsed.version };
		}
	} catch {
		return null;
	}

	return null;
}

/**
 * Serializes a versioned non-PII preference for localStorage.
 */
export function serializeAnalyticsPreference(state: AnalyticsPreferenceState): string {
	const preference: AnalyticsPreference = { state, version: ANALYTICS_CONSENT_VERSION };
	return JSON.stringify(preference);
}

/**
 * Whether GA may load for the given mode and stored preference.
 * Stored `denied` is always honored when a mode allows analytics.
 */
export function mayLoadAnalytics(options: { mode: AnalyticsMode; storedPreference: AnalyticsPreference | null }): boolean {
	if (options.mode === 'off') {
		return false;
	}

	if (options.mode === 'opt-in') {
		return options.storedPreference?.state === 'granted';
	}

	// opt-out: load unless explicitly denied
	return options.storedPreference?.state !== 'denied';
}

/**
 * Whether the analytics preference UI (banner / privacy settings) should be available.
 * Shown when analytics is enabled and mode is not `off`, even if a Measurement ID is unset
 * (so privacy settings remain reachable). Auto-open of the first-visit banner requires a
 * loadable ID — see `shouldAutoOpenConsentBanner`.
 */
export function shouldShowAnalyticsPreferenceUi(options: { mode: AnalyticsMode; analyticsEnabled: boolean }): boolean {
	return options.analyticsEnabled && options.mode !== 'off';
}

/**
 * Whether the first-visit consent banner should auto-open.
 * Requires a production-valid Measurement ID that can actually load GA.
 */
export function shouldAutoOpenConsentBanner(options: { mode: AnalyticsMode; analyticsEnabled: boolean; measurementId: string | null }): boolean {
	return shouldShowAnalyticsPreferenceUi({ mode: options.mode, analyticsEnabled: options.analyticsEnabled }) && Boolean(options.measurementId);
}

/**
 * Builds the inline loader that injects gtag according to analytics mode.
 * Always honors a stored `denied` preference. Never loads when mode is `off`.
 */
export function createModeAwareAnalyticsLoaderScript(options: { measurementId: string; mode: AnalyticsMode; initScript: string; origin?: string }): string {
	const measurementId = JSON.stringify(options.measurementId);
	const storageKey = JSON.stringify(ANALYTICS_CONSENT_STORAGE_KEY);
	const initScriptLiteral = JSON.stringify(options.initScript);
	const modeLiteral = JSON.stringify(options.mode);
	const versionLiteral = String(ANALYTICS_CONSENT_VERSION);
	const origin = JSON.stringify(options.origin ?? null);

	return `(()=>{
		const id=${measurementId}, key=${storageKey}, mode=${modeLiteral}, version=${versionLiteral}, origin=${origin};
		if (mode==='off' || (origin && location.origin!==origin)) return;
		function mayMeasure(){
			try {
				const raw=localStorage.getItem(key);
				const parsed=raw==='granted'||raw==='denied' ? {state:raw,version} : JSON.parse(raw);
				const state=parsed?.version===version ? parsed.state : null;
				return mode==='opt-in' ? state==='granted' : state!=='denied';
			} catch { return false; }
		}
		if (!mayMeasure()) return;
		window.barqMayMeasure=mayMeasure;
		const init=document.createElement('script');
		init.textContent=${initScriptLiteral};
		document.head.appendChild(init);
		const tag=document.createElement('script');
		tag.async=true;
		tag.referrerPolicy='no-referrer';
		tag.src='https://www.googletagmanager.com/gtag/js?id='+id;
		document.head.appendChild(tag);
	})();`;
}
