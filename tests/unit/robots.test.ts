import { describe, expect, it } from 'vitest';
import { FALLBACK_SITE_URL } from '@/lib/env/resolveSiteUrl';
import { isIndexableSiteOrigin, isSiteIndexable } from '@/lib/seo/indexingPolicy';
import { createRobotsTxt } from '@/lib/seo/robots';

describe('robots helpers', () => {
	it('treats the fallback example origin as non-indexable', () => {
		expect(isIndexableSiteOrigin(FALLBACK_SITE_URL)).toBe(false);
		expect(isIndexableSiteOrigin(`${FALLBACK_SITE_URL}/`)).toBe(false);
	});

	it('treats a real production origin as indexable', () => {
		expect(isIndexableSiteOrigin('https://quanizon.com')).toBe(true);
	});

	it('rejects an origin outside production and rejects non-public or non-origin URLs', () => {
		expect(isSiteIndexable('staging', 'https://quanizon.com')).toBe(false);
		expect(isSiteIndexable('production', 'https://quanizon.com')).toBe(true);
		for (const url of ['', 'http://example.com', 'http://localhost:4321', 'https://127.0.0.1', 'https://false_site.com', 'https://quanizon.com/app', 'https://quanizon.com/?x=y']) {
			expect(isIndexableSiteOrigin(url)).toBe(false);
		}
	});

	it('disallows crawlers in private previews', () => {
		const body = createRobotsTxt({ origin: FALLBACK_SITE_URL, indexable: false, privatePreview: true });
		expect(body).toContain('Disallow: /');
		expect(body).not.toContain('Sitemap:');
		expect(body).toContain('ENV=production');
		expect(body).toContain('PUBLIC_SITE_URL');
	});

	it('allows crawlers to read noindex in a public preview', () => {
		const body = createRobotsTxt({ origin: FALLBACK_SITE_URL, indexable: false });
		expect(body).toContain('Allow: /');
		expect(body).not.toContain('Disallow:');
		expect(body).not.toContain('Sitemap:');
	});

	it('allows crawlers and emits sitemap when indexable', () => {
		const body = createRobotsTxt({ origin: 'https://quanizon.com', indexable: true });
		expect(body).toContain('Allow: /');
		expect(body).toContain('Sitemap: https://quanizon.com/sitemap-index.xml');
		expect(body).not.toContain('Disallow:');
	});
});
