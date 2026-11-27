export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
	ar: 'rtl',
	en: 'ltr',
};

export function isLocale(value: string): value is Locale {
	return (locales as readonly string[]).includes(value);
}

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
	return localeDirections[locale];
}

export function localizePath(locale: Locale, path = '/'): string {
	const trimmed = path.replace(/^\/+|\/+$/g, '');
	const prefix = `/${locale}`;
	return trimmed ? `${prefix}/${trimmed}/` : `${prefix}/`;
}
