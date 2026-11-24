import { describe, expect, it } from 'vitest';
import { createLocaleAlternates } from '@/lib/seo/createLocaleAlternates';

describe('createLocaleAlternates', () => {
	it('builds reciprocal locale alternates and optional x-default', () => {
		const alternates = createLocaleAlternates({
			site: 'https://example.com',
			pathsByLocale: {
				ar: '/ar/',
				en: '/en/',
			},
			includeXDefault: true,
			xDefaultPath: '/ar/',
		});

		expect(alternates).toEqual([
			{ locale: 'ar', href: 'https://example.com/ar/' },
			{ locale: 'en', href: 'https://example.com/en/' },
			{ locale: 'x-default', href: 'https://example.com/ar/' },
		]);
	});
});
