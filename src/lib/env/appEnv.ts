export const APP_ENV_VALUES = ['local', 'staging', 'production'] as const;

export type AppEnv = (typeof APP_ENV_VALUES)[number];

/** True when the project work environment is production. */
export function isProductionAppEnv(env: AppEnv): boolean {
	return env === 'production';
}

/** True for local/staging (or any non-production) work environments. */
export function isNonProductionAppEnv(env: AppEnv): boolean {
	return env !== 'production';
}
