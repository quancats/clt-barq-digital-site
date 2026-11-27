import { defaultLocale, locales, localizePath } from '../i18n/config.ts';

export const hostRedirects = [{ from: '/', to: localizePath(defaultLocale), status: 302 }];
const legacyMoves = [
	['/home', '/'],
	['/blog', '/insights/articles'],
	['/services/second-service-service', '/services/cybersecurity'],
];
const slashVariants = ['', 'about', 'services', 'projects', 'contact'];

export function isHostRedirectSource(pathname) {
	return hostRedirects.some(({ from }) => from.replace(/\/$/, '') === pathname.replace(/\/$/, ''));
}

/** @param {Iterable<string>} routes */
export function renderHostRedirects(routes) {
	const pages = new Set(routes);
	const candidates = [...hostRedirects];
	const addLegacyPath = (from, to) => {
		candidates.push({ from, to, status: 301 }, { from: from.slice(0, -1), to, status: 301 });
	};
	for (const [from, to] of legacyMoves) {
		addLegacyPath(from + '/', localizePath('ar', to));
		for (const locale of locales) addLegacyPath(localizePath(locale, from), localizePath(locale, to));
	}
	for (const locale of locales) {
		for (const path of slashVariants) {
			const to = localizePath(locale, path);
			candidates.push({ from: to.slice(0, -1), to, status: 301 });
		}
	}
	const arabicHome = localizePath('ar');
	for (const to of [...pages].sort()) {
		if (to !== arabicHome && to.startsWith(arabicHome)) addLegacyPath(to.slice(arabicHome.length - 1), to);
	}
	const rules = candidates.filter(({ to }) => pages.has(to));
	const sources = new Set(rules.map(({ from }) => from));
	if (sources.size !== rules.length) throw new Error('Duplicate host redirect source');
	return rules
		.map(({ from, to, status }) => {
			if (sources.has(to) || !/^\/(?!\/)[a-z0-9/-]*$/i.test(to)) throw new Error(`Invalid redirect destination: ${from} -> ${to}`);
			return `${from} ${to} ${status}\n`;
		})
		.join('');
}
