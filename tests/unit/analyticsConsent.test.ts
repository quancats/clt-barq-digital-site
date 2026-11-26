import { describe, expect, it } from 'vitest';
import { ANALYTICS_CONSENT_STORAGE_KEY, ANALYTICS_CONSENT_VERSION, createModeAwareAnalyticsLoaderScript, mayLoadAnalytics, parseAnalyticsMode, parseAnalyticsPreference, serializeAnalyticsPreference, shouldAutoOpenConsentBanner, shouldShowAnalyticsPreferenceUi } from '@/lib/analytics/consent';

describe('analytics preference helpers', () => {
	it('parses analytics modes and falls back to opt-in', () => {
		expect(parseAnalyticsMode('off')).toBe('off');
		expect(parseAnalyticsMode('opt-out')).toBe('opt-out');
		expect(parseAnalyticsMode('opt-in')).toBe('opt-in');
		expect(parseAnalyticsMode(undefined)).toBe('opt-in');
		expect(parseAnalyticsMode('invalid')).toBe('opt-in');
	});

	it('parses versioned JSON and legacy string preferences', () => {
		expect(parseAnalyticsPreference(serializeAnalyticsPreference('granted'))).toEqual({
			state: 'granted',
			version: ANALYTICS_CONSENT_VERSION,
		});
		expect(parseAnalyticsPreference('denied')).toEqual({
			state: 'denied',
			version: ANALYTICS_CONSENT_VERSION,
		});
		expect(parseAnalyticsPreference(null)).toBeNull();
		expect(parseAnalyticsPreference('')).toBeNull();
		expect(parseAnalyticsPreference('maybe')).toBeNull();
		expect(parseAnalyticsPreference(JSON.stringify({ state: 'granted', version: 0 }))).toBeNull();
		expect(parseAnalyticsPreference('{not-json')).toBeNull();
	});

	it('serializes a versioned non-PII preference', () => {
		expect(JSON.parse(serializeAnalyticsPreference('denied'))).toEqual({
			state: 'denied',
			version: ANALYTICS_CONSENT_VERSION,
		});
	});

	it('never loads in off mode', () => {
		expect(mayLoadAnalytics({ mode: 'off', storedPreference: null })).toBe(false);
		expect(mayLoadAnalytics({ mode: 'off', storedPreference: { state: 'granted', version: 1 } })).toBe(false);
	});

	it('uses opt-out: load unless explicitly denied', () => {
		expect(mayLoadAnalytics({ mode: 'opt-out', storedPreference: null })).toBe(true);
		expect(mayLoadAnalytics({ mode: 'opt-out', storedPreference: { state: 'granted', version: 1 } })).toBe(true);
		expect(mayLoadAnalytics({ mode: 'opt-out', storedPreference: { state: 'denied', version: 1 } })).toBe(false);
	});

	it('uses opt-in: load only when granted', () => {
		expect(mayLoadAnalytics({ mode: 'opt-in', storedPreference: null })).toBe(false);
		expect(mayLoadAnalytics({ mode: 'opt-in', storedPreference: { state: 'denied', version: 1 } })).toBe(false);
		expect(mayLoadAnalytics({ mode: 'opt-in', storedPreference: { state: 'granted', version: 1 } })).toBe(true);
	});

	it('shows preference UI when analytics is enabled and mode is not off', () => {
		expect(shouldShowAnalyticsPreferenceUi({ mode: 'off', analyticsEnabled: true })).toBe(false);
		expect(shouldShowAnalyticsPreferenceUi({ mode: 'opt-in', analyticsEnabled: false })).toBe(false);
		expect(shouldShowAnalyticsPreferenceUi({ mode: 'opt-out', analyticsEnabled: true })).toBe(true);
		expect(shouldShowAnalyticsPreferenceUi({ mode: 'opt-in', analyticsEnabled: true })).toBe(true);
	});

	it('auto-opens the consent banner only when a Measurement ID can load', () => {
		expect(shouldAutoOpenConsentBanner({ mode: 'opt-in', analyticsEnabled: true, measurementId: null })).toBe(false);
		expect(shouldAutoOpenConsentBanner({ mode: 'opt-in', analyticsEnabled: true, measurementId: 'G-ABCDEF12' })).toBe(true);
		expect(shouldAutoOpenConsentBanner({ mode: 'off', analyticsEnabled: true, measurementId: 'G-ABCDEF12' })).toBe(false);
		expect(shouldAutoOpenConsentBanner({ mode: 'opt-in', analyticsEnabled: false, measurementId: 'G-ABCDEF12' })).toBe(false);
	});

	it('builds an opt-out loader that honors stored denial', () => {
		const script = createModeAwareAnalyticsLoaderScript({
			measurementId: 'G-ABCDEF12',
			mode: 'opt-out',
			initScript: "gtag('config','G-ABCDEF12');",
		});

		expect(script).toContain('G-ABCDEF12');
		expect(script).toContain(ANALYTICS_CONSENT_STORAGE_KEY);
		expect(script).toContain('googletagmanager.com/gtag/js');
		expect(script).toContain('"opt-out"');
		expect(script).toContain("state!=='denied'");
	});

	it('builds an opt-in loader that requires granted', () => {
		const script = createModeAwareAnalyticsLoaderScript({
			measurementId: 'G-ABCDEF12',
			mode: 'opt-in',
			initScript: "gtag('config','G-ABCDEF12');",
		});

		expect(script).toContain('"opt-in"');
		expect(script).toContain("==='granted'");
	});

	it('builds an off-mode loader that never injects', () => {
		const script = createModeAwareAnalyticsLoaderScript({
			measurementId: 'G-ABCDEF12',
			mode: 'off',
			initScript: "gtag('config','G-ABCDEF12');",
		});

		expect(script).toContain('"off"');
		expect(script).toContain("mode==='off'");
	});
});
