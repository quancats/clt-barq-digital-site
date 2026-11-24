import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';

export function resolveErrorSeo(locale: Locale, statusCode: number) {
	const dictionary = getDictionary(locale);
	const copy = dictionary.common.error;

	const title = statusCode === 404 ? copy.titles.not_found : statusCode === 500 ? copy.titles.server_error : copy.titles.generic.replace('{code}', String(statusCode));

	const description = statusCode === 404 ? copy.descriptions.not_found : statusCode === 500 ? copy.descriptions.server_error : copy.descriptions.generic;

	return {
		title: `${dictionary.common.brand} - ${title}`,
		description,
	};
}
