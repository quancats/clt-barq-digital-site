import { defaultLocale, localizePath } from '../i18n/config.ts';

export const hostRedirects = [{ from: '/ar/', to: localizePath(defaultLocale), status: 301 }];

export function isHostRedirectSource(pathname) {
	return hostRedirects.some(({ from }) => from.replace(/\/$/, '') === pathname.replace(/\/$/, ''));
}

export function renderHostRedirects() {
	const key = (route) => route.replace(/\/$/, '');
	const sources = new Set(hostRedirects.map(({ from }) => key(from)));
	if (sources.size !== hostRedirects.length) throw new Error('Duplicate host redirect source');
	return hostRedirects
		.map(({ from, to, status }) => {
			if (sources.has(key(to))) throw new Error(`Redirect chain or loop: ${from} -> ${to}`);
			return `${from} ${to} ${status}\n`;
		})
		.join('');
}
