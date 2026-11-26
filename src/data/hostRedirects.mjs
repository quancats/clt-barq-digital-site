import { defaultLocale, localizePath } from '../i18n/config.ts';

export const hostRedirects = [{ from: '/ar/', to: localizePath(defaultLocale), status: 301 }];
const legacyMoves = [
	['/home', '/'],
	['/blog', '/insights/articles'],
];
const slashVariants = ['/en', '/about', '/services', '/projects', '/contact', '/en/about', '/en/services', '/en/projects', '/en/contact'];

export function isHostRedirectSource(pathname) {
	return hostRedirects.some(({ from }) => from.replace(/\/$/, '') === pathname.replace(/\/$/, ''));
}

/** @param {(route: string) => boolean} hasTarget */
export function renderHostRedirects(hasTarget) {
	const candidates = [...hostRedirects];
	for (const [from, to] of legacyMoves) {
		for (const locale of ['ar', 'en']) {
			const source = localizePath(locale, from);
			const target = localizePath(locale, to);
			candidates.push({ from: source, to: target, status: 301 }, { from: source.slice(0, -1), to: target, status: 301 });
		}
	}
	for (const from of slashVariants) candidates.push({ from, to: from + '/', status: 301 });
	const rules = candidates.filter(({ to }) => hasTarget(to));
	const sources = new Set(rules.map(({ from }) => from));
	if (sources.size !== rules.length) throw new Error('Duplicate host redirect source');
	return rules
		.map(({ from, to, status }) => {
			if (sources.has(to) || !/^\/(?!\/)[a-z0-9/-]*$/i.test(to)) throw new Error(`Invalid redirect destination: ${from} -> ${to}`);
			return `${from} ${to} ${status}\n`;
		})
		.join('');
}
