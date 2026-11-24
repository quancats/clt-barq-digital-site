import { THEME_COLOR_DARK, THEME_COLOR_LIGHT } from '@/data/site';

export const themeModes = ['light', 'dark', 'auto'] as const;
export type ThemeMode = (typeof themeModes)[number];
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'site-theme';
/** Monotonic schema version for theme preference storage. Never downgrade a newer stored schema. */
export const THEME_SCHEMA_STORAGE_KEY = 'site-theme-schema';
export const THEME_SCHEMA_VERSION = 1;
export const DEFAULT_THEME: ThemeMode = 'auto';

export interface ThemePreference {
	mode: ThemeMode;
	version: number;
}

export function isThemeMode(value: unknown): value is ThemeMode {
	return typeof value === 'string' && (themeModes as readonly string[]).includes(value);
}

/**
 * Reads a stored theme preference.
 * Supports legacy scalar `light`/`dark`/`auto` values (treated as schema v1).
 * Newer stored schemas are never downgraded; the mode is used when still valid.
 */
export function readThemePreference(options: { storedMode: string | null | undefined; storedSchema: string | null | undefined; fallback?: ThemeMode }): ThemePreference {
	const fallback = options.fallback ?? DEFAULT_THEME;
	const storedVersion = parseSchemaVersion(options.storedSchema);

	if (isThemeMode(options.storedMode)) {
		return {
			mode: options.storedMode,
			version: storedVersion ?? THEME_SCHEMA_VERSION,
		};
	}

	return {
		mode: fallback,
		version: Math.max(storedVersion ?? THEME_SCHEMA_VERSION, THEME_SCHEMA_VERSION),
	};
}

/**
 * Whether local storage should be rewritten for the current schema.
 * Returns false when the stored schema is newer than this build (no downgrade).
 */
export function shouldPersistThemeSchema(storedVersion: number | null): boolean {
	return storedVersion == null || storedVersion <= THEME_SCHEMA_VERSION;
}

export function resolveStoredTheme(stored: string | null | undefined, fallback: ThemeMode = DEFAULT_THEME): ThemeMode {
	return isThemeMode(stored) ? stored : fallback;
}

export function resolveThemeMode(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
	if (mode === 'auto') {
		return prefersDark ? 'dark' : 'light';
	}

	return mode;
}

export function applyThemeColor(resolved: ResolvedTheme, doc: Document = document): void {
	let themeColorMeta = doc.querySelector('meta[name="theme-color"]');
	if (!themeColorMeta) {
		themeColorMeta = doc.createElement('meta');
		themeColorMeta.setAttribute('name', 'theme-color');
		doc.head.appendChild(themeColorMeta);
	}
	themeColorMeta.setAttribute('content', resolved === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
}

export function applyResolvedTheme(resolved: ResolvedTheme, root: HTMLElement = document.documentElement): void {
	root.classList.toggle('dark', resolved === 'dark');
	root.dataset.theme = resolved;
	root.style.colorScheme = resolved;
	if (typeof document !== 'undefined') {
		applyThemeColor(resolved, document);
	}
}

/**
 * Persists theme mode + schema when safe (never downgrades a newer schema).
 * No-ops when `storage` is unavailable (SSR / blocked storage).
 */
export function persistThemePreference(mode: ThemeMode, storage: Pick<Storage, 'getItem' | 'setItem'> | null | undefined): void {
	if (!storage) return;
	try {
		const storedVersion = parseSchemaVersion(storage.getItem(THEME_SCHEMA_STORAGE_KEY));
		storage.setItem(THEME_STORAGE_KEY, mode);
		if (shouldPersistThemeSchema(storedVersion)) {
			storage.setItem(THEME_SCHEMA_STORAGE_KEY, String(THEME_SCHEMA_VERSION));
		}
	} catch {
		// Ignore storage failures (private mode / blocked storage).
	}
}

function parseSchemaVersion(raw: string | null | undefined): number | null {
	if (raw == null || raw === '') return null;
	const value = Number.parseInt(raw, 10);
	return Number.isFinite(value) && value > 0 ? value : null;
}
