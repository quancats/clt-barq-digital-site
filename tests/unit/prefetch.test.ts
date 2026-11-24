import { describe, expect, it } from 'vitest';
import { PRIMARY_NAV_PREFETCH_ATTRS, shouldPrefetchHref } from '@/lib/navigation/prefetch';

describe('prefetch policy helpers', () => {
	it('exposes the Astro opt-in attribute', () => {
		expect(PRIMARY_NAV_PREFETCH_ATTRS['data-astro-prefetch']).toBe(true);
	});

	it('allows internal paths and rejects external or non-navigation hrefs', () => {
		expect(shouldPrefetchHref('/en/articles/')).toBe(true);
		expect(shouldPrefetchHref('/ar/')).toBe(true);
		expect(shouldPrefetchHref('https://example.com')).toBe(false);
		expect(shouldPrefetchHref('//cdn.example.com')).toBe(false);
		expect(shouldPrefetchHref('#main')).toBe(false);
		expect(shouldPrefetchHref('mailto:hi@example.com')).toBe(false);
		expect(shouldPrefetchHref('')).toBe(false);
	});
});
