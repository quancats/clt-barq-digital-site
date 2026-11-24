import { describe, expect, it } from 'vitest';
import { createGoogleAnalyticsInitScript, isGoogleAnalyticsEnabled, isValidGoogleAnalyticsId, resolveGoogleAnalyticsId } from '@/lib/analytics/googleAnalytics';

describe('googleAnalytics helpers', () => {
	it('validates GA4 Measurement IDs', () => {
		expect(isValidGoogleAnalyticsId('G-ABCDEF12')).toBe(true);
		expect(isValidGoogleAnalyticsId('g-abcdef12')).toBe(true);
		expect(isValidGoogleAnalyticsId(' G-ABCDEF12 ')).toBe(true);
		expect(isValidGoogleAnalyticsId(undefined)).toBe(false);
		expect(isValidGoogleAnalyticsId(null)).toBe(false);
		expect(isValidGoogleAnalyticsId('')).toBe(false);
		expect(isValidGoogleAnalyticsId('UA-123456-1')).toBe(false);
		expect(isValidGoogleAnalyticsId('G-')).toBe(false);
		expect(isValidGoogleAnalyticsId('not-an-id')).toBe(false);
	});

	it('treats analytics as enabled by default and honors explicit disable values', () => {
		expect(isGoogleAnalyticsEnabled(undefined)).toBe(true);
		expect(isGoogleAnalyticsEnabled('')).toBe(true);
		expect(isGoogleAnalyticsEnabled(true)).toBe(true);
		expect(isGoogleAnalyticsEnabled('true')).toBe(true);
		expect(isGoogleAnalyticsEnabled(false)).toBe(false);
		expect(isGoogleAnalyticsEnabled('false')).toBe(false);
		expect(isGoogleAnalyticsEnabled('0')).toBe(false);
		expect(isGoogleAnalyticsEnabled('off')).toBe(false);
		expect(isGoogleAnalyticsEnabled('no')).toBe(false);
	});

	it('disables analytics when unset, non-prod, invalid, or explicitly disabled', () => {
		expect(
			resolveGoogleAnalyticsId({
				measurementId: undefined,
				isProd: true,
			}),
		).toBeNull();

		expect(
			resolveGoogleAnalyticsId({
				measurementId: 'G-ABCDEF12',
				isProd: false,
			}),
		).toBeNull();

		expect(
			resolveGoogleAnalyticsId({
				measurementId: 'UA-123456-1',
				isProd: true,
			}),
		).toBeNull();

		expect(
			resolveGoogleAnalyticsId({
				measurementId: 'G-ABCDEF12',
				isProd: true,
				enabled: false,
			}),
		).toBeNull();
	});

	it('enables analytics for production builds with a valid ID when not disabled', () => {
		expect(
			resolveGoogleAnalyticsId({
				measurementId: ' G-ABCDEF12 ',
				isProd: true,
			}),
		).toBe('G-ABCDEF12');

		expect(
			resolveGoogleAnalyticsId({
				measurementId: 'G-ABCDEF12',
				isProd: true,
				enabled: true,
			}),
		).toBe('G-ABCDEF12');
	});

	it('builds a config snippet that embeds the Measurement ID safely', () => {
		const script = createGoogleAnalyticsInitScript('G-ABCDEF12');
		expect(script).toContain('gtag(');
		expect(script).toContain('"G-ABCDEF12"');
		expect(script).not.toContain('G-ABCDEF12;');
	});
});
