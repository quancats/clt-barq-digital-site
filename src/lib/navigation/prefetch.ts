/**
 * Prefetch policy for internal navigation (ADR-0018 amendment).
 *
 * Astro `prefetch.defaultStrategy` applies only to links that opt in via
 * `data-astro-prefetch`. Baseline opts in primary nav and high-confidence CTAs.
 *
 * Do not prefetch: external links, downloads, logout/mutation-like actions,
 * privacy/legal destinations without demonstrated benefit, or every card/article link.
 */

/** Attribute bag for Astro templates and Vue fallthrough attrs. */
export const PRIMARY_NAV_PREFETCH_ATTRS = {
	'data-astro-prefetch': true,
} as const;

/**
 * Returns true when an href is an internal same-origin path suitable for baseline prefetch.
 */
export function shouldPrefetchHref(href: string): boolean {
	if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
		return false;
	}

	if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
		return false;
	}

	return true;
}
