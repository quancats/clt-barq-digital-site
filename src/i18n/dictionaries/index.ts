import { ar } from '@/i18n/dictionaries/ar';
import { en } from '@/i18n/dictionaries/en';
import type { Locale } from '@/i18n/config';

type WidenStrings<T> = {
	[K in keyof T]: K extends 'type' ? T[K] : T[K] extends string ? string : WidenStrings<T[K]>;
};

export type Dictionary = WidenStrings<typeof ar>;

export const dictionaries: Record<Locale, Dictionary> = {
	ar,
	en,
};
