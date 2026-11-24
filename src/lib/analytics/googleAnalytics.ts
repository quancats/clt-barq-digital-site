/** GA4 Measurement ID pattern (`G-` + alphanumeric). */
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

/**
 * Returns true when `value` looks like a GA4 Measurement ID.
 */
export function isValidGoogleAnalyticsId(value: string | undefined | null): value is string {
	if (typeof value !== 'string') {
		return false;
	}

	return GA_MEASUREMENT_ID_PATTERN.test(value.trim());
}

/**
 * Parses the public enable flag. Defaults to enabled when unset.
 * Explicit `false` / `0` / `no` / `off` disables injection.
 */
export function isGoogleAnalyticsEnabled(value: string | boolean | undefined | null): boolean {
	if (typeof value === 'boolean') {
		return value;
	}

	if (value == null || value === '') {
		return true;
	}

	const normalized = String(value).trim().toLowerCase();
	return !['false', '0', 'no', 'off'].includes(normalized);
}

/**
 * Resolves the Measurement ID to inject for production builds when analytics is enabled
 * and a valid ID is configured. Development stays analytics-free.
 */
export function resolveGoogleAnalyticsId(options: { measurementId: string | undefined; isProd: boolean; enabled?: string | boolean | undefined }): string | null {
	if (!options.isProd) {
		return null;
	}

	if (!isGoogleAnalyticsEnabled(options.enabled)) {
		return null;
	}

	const measurementId = options.measurementId?.trim();
	if (!measurementId || !isValidGoogleAnalyticsId(measurementId)) {
		return null;
	}

	return measurementId;
}

/**
 * Builds the inline gtag bootstrap snippet for a validated Measurement ID.
 */
export function createGoogleAnalyticsInitScript(measurementId: string): string {
	const idLiteral = JSON.stringify(measurementId);
	return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${idLiteral});`;
}
