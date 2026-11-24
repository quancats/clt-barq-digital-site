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
export function createModeAwareAnalyticsLoaderScript(options: { measurementId: string; mode: AnalyticsMode; initScript: string }): string {
	const measurementId = JSON.stringify(options.measurementId);
	const storageKey = JSON.stringify(ANALYTICS_CONSENT_STORAGE_KEY);
	const initScriptLiteral = JSON.stringify(options.initScript);
	const modeLiteral = JSON.stringify(options.mode);
	const versionLiteral = String(ANALYTICS_CONSENT_VERSION);

	return `(()=>{const id=${measurementId};const key=${storageKey};const initSource=${initScriptLiteral};const mode=${modeLiteral};const version=${versionLiteral};let loaded=false;function readPreference(){try{const raw=localStorage.getItem(key);if(!raw)return null;if(raw==='granted'||raw==='denied')return{state:raw,version:version};const parsed=JSON.parse(raw);if((parsed.state==='granted'||parsed.state==='denied')&&parsed.version===version)return parsed;return null;}catch{return null;}}function load(){if(loaded||mode==='off')return;loaded=true;const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s);const i=document.createElement('script');i.textContent=initSource;document.head.appendChild(i);}function maybeLoad(){const pref=readPreference();if(mode==='off')return;if(mode==='opt-in'){if(pref&&pref.state==='granted')load();return;}if(!pref||pref.state!=='denied')load();}maybeLoad();})();`;
}
