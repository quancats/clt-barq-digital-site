import { describe, expect, it } from 'vitest';
import { createArticleJsonLd } from '@/lib/seo/structured-data/createArticleJsonLd';
import { createBreadcrumbListJsonLd } from '@/lib/seo/structured-data/createBreadcrumbListJsonLd';
import { createOrganizationJsonLd } from '@/lib/seo/structured-data/createOrganizationJsonLd';
import { createPersonIdRef, createPersonJsonLd } from '@/lib/seo/structured-data/createPersonJsonLd';
import { createWebSiteJsonLd } from '@/lib/seo/structured-data/createWebSiteJsonLd';

describe('structured data helpers', () => {
	const site = 'https://example.com';

	it('creates WebSite JSON-LD', () => {
		const jsonLd = createWebSiteJsonLd({
			site,
			name: 'Astro Content Template',
			description: 'Demo site',
			path: '/ar/',
		});

		expect(jsonLd['@type']).toBe('WebSite');
		expect(jsonLd.url).toBe('https://example.com/ar/');
		expect(jsonLd.name).toBe('Astro Content Template');
		expect(jsonLd.publisher).toBeUndefined();
	});

	it('optionally links WebSite to a Person @id', () => {
		const jsonLd = createWebSiteJsonLd({
			site,
			name: 'Portfolio',
			description: 'Personal site',
			path: '/en/',
			linkPerson: true,
		});

		expect(jsonLd.publisher).toEqual({ '@id': 'https://example.com/#person' });
		expect(jsonLd.author).toEqual({ '@id': 'https://example.com/#person' });
	});

	it('creates Organization JSON-LD with optional logo and sameAs', () => {
		const jsonLd = createOrganizationJsonLd({
			site,
			name: 'Acme',
			description: 'Company site',
			path: '/en/',
			logoPath: '/images/og/default.png',
			sameAs: ['https://github.com/acme'],
			parentOrganizationName: 'Acme Holdings',
		});

		expect(jsonLd['@type']).toBe('Organization');
		expect(jsonLd.url).toBe('https://example.com/en/');
		expect(jsonLd.logo).toBe('https://example.com/images/og/default.png');
		expect(jsonLd.sameAs).toEqual(['https://github.com/acme']);
		expect(jsonLd.parentOrganization).toEqual({ '@type': 'Organization', name: 'Acme Holdings' });
	});

	it('creates Person JSON-LD and omits unset PII', () => {
		const jsonLd = createPersonJsonLd({
			id: 'https://example.com/#person',
			url: 'https://example.com/en/',
			name: 'Ada Example',
			jobTitle: 'Engineer',
		});

		expect(jsonLd['@type']).toBe('Person');
		expect(jsonLd['@id']).toBe('https://example.com/#person');
		expect(jsonLd.email).toBeUndefined();
		expect(jsonLd.telephone).toBeUndefined();
		expect(createPersonIdRef(site)).toEqual({ '@id': 'https://example.com/#person' });
	});

	it('creates Article JSON-LD with published dates', () => {
		const publishedAt = new Date('2026-01-15T00:00:00.000Z');
		const jsonLd = createArticleJsonLd({
			site,
			path: '/en/articles/welcome/',
			title: 'Welcome',
			description: 'Intro',
			publishedAt,
			locale: 'en',
			image: '/images/og/default.png',
		});

		expect(jsonLd['@type']).toBe('Article');
		expect(jsonLd.headline).toBe('Welcome');
		expect(jsonLd.datePublished).toBe(publishedAt.toISOString());
		expect(jsonLd.dateModified).toBe(publishedAt.toISOString());
		expect(jsonLd.image).toEqual(['https://example.com/images/og/default.png']);
	});

	it('creates BreadcrumbList JSON-LD', () => {
		const jsonLd = createBreadcrumbListJsonLd({
			site,
			items: [
				{ label: 'Home', path: '/en/' },
				{ label: 'Articles', path: '/en/articles/' },
				{ label: 'Welcome', path: '/en/articles/welcome/' },
			],
		});

		expect(jsonLd['@type']).toBe('BreadcrumbList');
		expect(jsonLd.itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/en/' },
			{ '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://example.com/en/articles/' },
			{ '@type': 'ListItem', position: 3, name: 'Welcome', item: 'https://example.com/en/articles/welcome/' },
		]);
	});
});
