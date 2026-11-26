import { describe, expect, it } from 'vitest';
import { renderHostRedirects } from '@/data/hostRedirects.mjs';

describe('published legacy redirects', () => {
	it('omits aliases with no generated locale destination', () => {
		const available = new Set(['/', '/en/', '/insights/articles/', '/about/']);
		const rules = renderHostRedirects((route) => available.has(route))
			.trim()
			.split('\n');
		expect(rules).toEqual(['/ar/ / 301', '/home/ / 301', '/home / 301', '/en/home/ /en/ 301', '/en/home /en/ 301', '/blog/ /insights/articles/ 301', '/blog /insights/articles/ 301', '/en /en/ 301', '/about /about/ 301']);
	});
});
