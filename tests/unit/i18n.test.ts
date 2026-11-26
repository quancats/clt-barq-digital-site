import { describe, expect, it } from 'vitest';
import { localizePath } from '@/i18n/config';
import { formatDate, formatNumber } from '@/i18n/format';
import { getAlternateLocale, mapStaticPathToLocale, stripLocalePrefix } from '@/i18n/helpers';

describe('i18n helpers', () => {
	it('prefixes English and keeps the default locale at the root', () => {
		expect(localizePath('ar', '/')).toBe('/');
		expect(localizePath('ar', '/articles')).toBe('/articles/');
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
		expect(mapStaticPathToLocale('/en/articles/', 'ar')).toBe('/articles/');
		expect(getAlternateLocale('ar')).toBe('en');
	});

	it('formats dates in UTC and uses locale-specific numbers', () => {
		const date = new Date('2026-11-25T23:30:00.000Z');
		expect(formatDate('en', date)).toBe('Nov 25, 2026');
		expect(formatDate('ar', date)).toContain('٢٥');
		expect(formatNumber('en', 1234)).toBe('1,234');
		expect(formatNumber('ar', 1234)).toBe('١٬٢٣٤');
	});
});
