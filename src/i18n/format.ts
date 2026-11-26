import type { Locale } from './config';

const formats: Record<Locale, string> = { ar: 'ar-SA', en: 'en' };

export function formatDate(locale: Locale, date: Date): string {
	return new Intl.DateTimeFormat(formats[locale], { dateStyle: 'medium', calendar: 'gregory', timeZone: 'UTC' }).format(date);
}

export function formatNumber(locale: Locale, value: number): string {
	return new Intl.NumberFormat(formats[locale]).format(value);
}
