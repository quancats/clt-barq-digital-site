import { describe, expect, it } from 'vitest';
import { renderHostRedirects } from '@/data/hostRedirects.mjs';

describe('published legacy redirects', () => {
	it('redirects the root to English and migrates existing Arabic destinations', () => {
		const available = ['/ar/', '/en/', '/ar/insights/articles/', '/ar/about/'];
		const rules = renderHostRedirects(available).trim().split('\n');
		expect(rules).toEqual(expect.arrayContaining(['/ /en/ 302', '/about/ /ar/about/ 301', '/about /ar/about/ 301', '/home/ /ar/ 301', '/blog/ /ar/insights/articles/ 301', '/ar /ar/ 301', '/en /en/ 301']));
		expect(rules.some((rule) => rule.startsWith('/ar/ ') || rule.startsWith('/en/ ') || rule.includes('/en/insights/articles/') || rule.includes('/ar/services/'))).toBe(false);
	});

	it('migrates the legacy cybersecurity service only where a localized replacement exists', () => {
		const rules = renderHostRedirects(['/ar/', '/en/', '/en/services/cybersecurity/']).trim().split('\n');
		expect(rules).toEqual(expect.arrayContaining(['/en/services/second-service-service /en/services/cybersecurity/ 301', '/en/services/second-service-service/ /en/services/cybersecurity/ 301']));
		expect(rules.filter((rule) => rule.includes('second-service-service'))).toHaveLength(2);
	});
});
