import { describe, expect, it } from 'vitest';
import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

describe('createCanonicalUrl', () => {
	it('creates a locale-specific absolute URL', () => {
		expect(
			createCanonicalUrl({
				site: new URL('https://example.com'),
				path: '/ar/about/',
			}).toString(),
		).toBe('https://example.com/ar/about/');
	});
});
