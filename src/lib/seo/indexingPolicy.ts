import { isIP } from 'node:net';

const domainLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const reservedHost = /(^|\.)(?:example\.(?:com|net|org)|localhost|local|test|invalid|example|internal)$/;

export function isIndexableSiteOrigin(origin: string): boolean {
	const url = URL.parse(origin.trim().replace(/^(['"])(.*)\1$/, '$2'));
	if (!url || !['http:', 'https:'].includes(url.protocol)) return false;
	if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) return false;

	const host = url.hostname.replace(/\.$/, '');
	const labels = host.split('.');
	return labels.length > 1 && labels.every((label) => domainLabel.test(label)) && !isIP(host) && !reservedHost.test(host);
}

export function isSiteIndexable(environment: string, origin: string): boolean {
	return environment === 'production' && isIndexableSiteOrigin(origin);
}
