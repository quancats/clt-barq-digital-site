import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { createModeAwareAnalyticsLoaderScript, type AnalyticsMode } from '@/lib/analytics/consent';
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

	it('never loads on a preview origin, in off mode or without the required consent', () => {
		for (const [mode, preference, origin] of [
			['opt-in', 'granted', 'https://preview.example'],
			['off', 'granted', 'https://barq.example'],
			['opt-in', null, 'https://barq.example'],
			['opt-out', 'denied', 'https://barq.example'],
		] as const) {
			const result = runAnalytics(mode, preference, origin);
			expect(result.scripts).toEqual([]);
			expect(result.events()).toEqual([]);
		}
	});

	it('sends only safe explicit page, CTA and deduplicated acceptance events', () => {
		const result = runAnalytics('opt-in', 'granted');
		expect(result.scripts).toHaveLength(1);
		expect(result.events().map((event) => event[1])).toEqual(['page_view']);
		result.click('bim_outbound');
		result.click('unknown_cta');
		result.accept('invalid_type');
		result.accept('demo');
		result.accept('demo');
		expect(result.events().map((event) => event[1])).toEqual(['page_view', 'bim_outbound', 'lead_accepted']);
		expect(result.events()[2]?.[2]).toMatchObject({ lead_type: 'demo', language: 'en', page_location: 'https://barq.example/en/contact/', page_referrer: '' });
		expect(JSON.stringify(result.events())).not.toMatch(/PRIVATE|mailto|sensitive/);
		result.deny();
		result.click('contact_action');
		expect(result.events()).toHaveLength(3);
	});

	it('supports opt-out and tolerates blocked provider scripts', () => {
		const result = runAnalytics('opt-out', null);
		expect(result.scripts).toHaveLength(1);
		expect(() => result.click('contact_action')).not.toThrow();
		expect(result.events().map((event) => event[1])).toEqual(['page_view', 'contact_action']);
	});
});

function runAnalytics(mode: AnalyticsMode, preference: string | null, origin = 'https://barq.example') {
	let stored = preference;
	const listeners = new Map<string, (event: unknown) => void>();
	const scripts: string[] = [];
	const window: { dataLayer?: Iterable<Iterable<unknown>> } = {};
	const document = {
		createElement: () => ({ src: '', textContent: '' }),
		head: {
			appendChild(element: { src: string; textContent: string }) {
				if (element.src) scripts.push(element.src);
				else runInNewContext(element.textContent, context);
			},
		},
		addEventListener(name: string, listener: (event: unknown) => void) {
			listeners.set(name, listener);
		},
	};
	const context = { window, document, location: { origin }, localStorage: { getItem: () => stored } };
	const initScript = createGoogleAnalyticsInitScript('G-TEST1234', 'https://barq.example/en/contact/?sensitive=PRIVATE#PRIVATE', 'en');
	runInNewContext(createModeAwareAnalyticsLoaderScript({ measurementId: 'G-TEST1234', origin: 'https://barq.example', mode, initScript }), context);
	return {
		scripts,
		events: () => Array.from(window.dataLayer ?? [], (args) => [...args]).filter(([command]) => command === 'event'),
		click: (action: string) => listeners.get('click')?.({ target: { closest: () => ({ href: 'mailto:PRIVATE', dataset: { analyticsAction: action } }) } }),
		accept: (detail: string) => listeners.get('barq:lead-accepted')?.({ detail }),
		deny: () => {
			stored = 'denied';
		},
	};
}
