import { defaultLocale, isLocale, type Locale, localizePath } from '@/i18n/config';
import { dictionaries, type Dictionary } from '@/i18n/dictionaries';

export function getDictionary(locale: Locale): Dictionary {
	return dictionaries[locale];
}

export function resolveLocaleFromPathname(pathname: string): Locale {
	const segment = pathname.split('/').filter(Boolean)[0];
	return segment && isLocale(segment) ? segment : defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
	const parts = pathname.split('/').filter(Boolean);
	if (parts[0] && isLocale(parts[0])) {
		const rest = parts.slice(1).join('/');
		return rest ? `/${rest}` : '/';
	}
	if (pathname === '/' || pathname === '') {
		return '/';
	}
	return pathname.replace(/\/+$/, '') || '/';
}

export function getAlternateLocale(locale: Locale): Locale {
	return locale === 'ar' ? 'en' : 'ar';
}

export function mapStaticPathToLocale(pathname: string, targetLocale: Locale): string {
	const bare = stripLocalePrefix(pathname);
	return localizePath(targetLocale, bare === '/' ? '/' : bare.replace(/\/+$/, '') || '/');
}
