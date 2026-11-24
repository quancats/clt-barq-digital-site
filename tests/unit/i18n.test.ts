import { describe, expect, it } from 'vitest';
import { localizePath } from '@/i18n/config';
import { getAlternateLocale, mapStaticPathToLocale, stripLocalePrefix } from '@/i18n/helpers';

describe('i18n helpers', () => {
	it('prefixes locales with trailing slashes', () => {
		expect(localizePath('ar', '/')).toBe('/ar/');
		expect(localizePath('en', '/articles')).toBe('/en/articles/');
		expect(localizePath('en', '/articles/')).toBe('/en/articles/');
	});

	it('strips locale prefixes', () => {
		expect(stripLocalePrefix('/ar/articles')).toBe('/articles');
		expect(stripLocalePrefix('/ar/articles/')).toBe('/articles');
		expect(stripLocalePrefix('/en')).toBe('/');
		expect(stripLocalePrefix('/en/')).toBe('/');
	});

	it('maps static paths between locales', () => {
		expect(mapStaticPathToLocale('/ar/articles', 'en')).toBe('/en/articles/');
		expect(mapStaticPathToLocale('/ar/articles/', 'en')).toBe('/en/articles/');
		expect(getAlternateLocale('ar')).toBe('en');
	});
});
