import { describe, expect, it } from 'vitest';
import { isIndexableSitemapPage } from '@/lib/seo/isIndexableSitemapPage';

describe('isIndexableSitemapPage', () => {
	it('includes locale homes, articles, and catalog routes', () => {
		expect(isIndexableSitemapPage('https://example.com/ar/')).toBe(true);
		expect(isIndexableSitemapPage('https://example.com/en/')).toBe(true);
		expect(isIndexableSitemapPage('https://example.com/ar/articles/welcome/')).toBe(true);
		expect(isIndexableSitemapPage('https://example.com/en/components/')).toBe(true);
	});

	it('excludes locale-less root, errors, robots, feeds, and well-known', () => {
		expect(isIndexableSitemapPage('https://example.com/')).toBe(true);
		expect(isIndexableSitemapPage('https://example.com/404')).toBe(false);
		expect(isIndexableSitemapPage('https://example.com/500')).toBe(false);
		expect(isIndexableSitemapPage('https://example.com/robots.txt')).toBe(false);
		expect(isIndexableSitemapPage('https://example.com/ar/rss.xml')).toBe(false);
		expect(isIndexableSitemapPage('https://example.com/.well-known/security.txt')).toBe(false);
	});

	it('fails closed on invalid URLs', () => {
		expect(isIndexableSitemapPage('not-a-url')).toBe(false);
	});
});
