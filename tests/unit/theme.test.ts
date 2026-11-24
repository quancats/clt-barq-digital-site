import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, THEME_SCHEMA_STORAGE_KEY, THEME_SCHEMA_VERSION, THEME_STORAGE_KEY, isThemeMode, persistThemePreference, readThemePreference, resolveStoredTheme, resolveThemeMode, shouldPersistThemeSchema } from '@/scripts/theme';
import { createThemeInitScript } from '@/scripts/createThemeInitScript';

describe('theme helpers', () => {
	it('validates theme modes', () => {
		expect(isThemeMode('light')).toBe(true);
		expect(isThemeMode('dark')).toBe(true);
		expect(isThemeMode('auto')).toBe(true);
		expect(isThemeMode('system')).toBe(false);
		expect(isThemeMode(null)).toBe(false);
	});

	it('falls back to the configured default for invalid stored values', () => {
		expect(resolveStoredTheme(null)).toBe(DEFAULT_THEME);
		expect(resolveStoredTheme('nope', 'light')).toBe('light');
		expect(resolveStoredTheme('dark', 'auto')).toBe('dark');
	});

	it('resolves auto from the system preference', () => {
		expect(resolveThemeMode('auto', true)).toBe('dark');
		expect(resolveThemeMode('auto', false)).toBe('light');
		expect(resolveThemeMode('light', true)).toBe('light');
		expect(resolveThemeMode('dark', false)).toBe('dark');
	});

	it('reads legacy scalar preferences as schema v1', () => {
		expect(readThemePreference({ storedMode: 'dark', storedSchema: null })).toEqual({
			mode: 'dark',
			version: THEME_SCHEMA_VERSION,
		});
	});

	it('never treats a newer stored schema as downgrade-eligible', () => {
		expect(shouldPersistThemeSchema(null)).toBe(true);
		expect(shouldPersistThemeSchema(THEME_SCHEMA_VERSION)).toBe(true);
		expect(shouldPersistThemeSchema(THEME_SCHEMA_VERSION + 1)).toBe(false);
		expect(
			readThemePreference({
				storedMode: 'light',
				storedSchema: String(THEME_SCHEMA_VERSION + 3),
			}),
		).toEqual({
			mode: 'light',
			version: THEME_SCHEMA_VERSION + 3,
		});
	});

	it('persists mode and schema without downgrading newer schemas', () => {
		const storage = new Map<string, string>();
		const fakeStorage = {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => {
				storage.set(key, value);
			},
		};

		persistThemePreference('dark', fakeStorage);
		expect(storage.get(THEME_STORAGE_KEY)).toBe('dark');
		expect(storage.get(THEME_SCHEMA_STORAGE_KEY)).toBe(String(THEME_SCHEMA_VERSION));

		storage.set(THEME_SCHEMA_STORAGE_KEY, String(THEME_SCHEMA_VERSION + 2));
		persistThemePreference('light', fakeStorage);
		expect(storage.get(THEME_STORAGE_KEY)).toBe('light');
		expect(storage.get(THEME_SCHEMA_STORAGE_KEY)).toBe(String(THEME_SCHEMA_VERSION + 2));
	});

	it('embeds schema migration keys in the pre-paint init script', () => {
		const script = createThemeInitScript('auto');
		expect(script).toContain(THEME_STORAGE_KEY);
		expect(script).toContain(THEME_SCHEMA_STORAGE_KEY);
		expect(script).toContain(String(THEME_SCHEMA_VERSION));
		expect(script).toContain('parsedSchema <= schemaVersion');
	});
});
