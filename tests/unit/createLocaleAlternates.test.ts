import { describe, expect, it } from 'vitest';
import { createLocaleAlternates } from '@/lib/seo/createLocaleAlternates';

describe('createLocaleAlternates', () => {
	it('does not emit an alternate for a missing translation', () => {
		expect(createLocaleAlternates({ site: 'https://example.com', pathsByLocale: { ar: '/articles/ar-only/' } })).toEqual([{ locale: 'ar', href: 'https://example.com/articles/ar-only/' }]);
	});

	it('builds reciprocal locale alternates and optional x-default', () => {
		const alternates = createLocaleAlternates({
			site: 'https://example.com',
			pathsByLocale: {
				ar: '/',
				en: '/en/',
			},
			includeXDefault: true,
			xDefaultPath: '/',
		});

		expect(alternates).toEqual([
			{ locale: 'ar', href: 'https://example.com/' },
			{ locale: 'en', href: 'https://example.com/en/' },
			{ locale: 'x-default', href: 'https://example.com/' },
		]);
	});
});
