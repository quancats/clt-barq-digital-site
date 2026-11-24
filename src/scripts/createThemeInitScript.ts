import { THEME_COLOR_DARK, THEME_COLOR_LIGHT } from '@/data/site';
import { DEFAULT_THEME, THEME_SCHEMA_STORAGE_KEY, THEME_SCHEMA_VERSION, THEME_STORAGE_KEY, resolveStoredTheme, type ThemeMode } from '@/scripts/theme';

/**
 * Builds a tiny inline bootstrap script that applies the theme before first paint.
 * Migrates legacy scalar preferences to schema v1; never downgrades a newer stored schema.
 * Keep this free of imports so it can run as `is:inline`.
 */
export function createThemeInitScript(defaultTheme: ThemeMode = DEFAULT_THEME): string {
	const storageKey = JSON.stringify(THEME_STORAGE_KEY);
	const schemaKey = JSON.stringify(THEME_SCHEMA_STORAGE_KEY);
	const schemaVersion = String(THEME_SCHEMA_VERSION);
	const fallback = JSON.stringify(resolveStoredTheme(defaultTheme, DEFAULT_THEME));
	const lightColor = JSON.stringify(THEME_COLOR_LIGHT);
	const darkColor = JSON.stringify(THEME_COLOR_DARK);

	return `(() => {
  const storageKey = ${storageKey};
  const schemaKey = ${schemaKey};
  const schemaVersion = ${schemaVersion};
  const fallback = ${fallback};
  const lightColor = ${lightColor};
  const darkColor = ${darkColor};
  const modes = new Set(["light", "dark", "auto"]);
  let storedMode = null;
  let storedSchema = null;
  try {
    storedMode = localStorage.getItem(storageKey);
    storedSchema = localStorage.getItem(schemaKey);
  } catch {}
  const mode = modes.has(storedMode) ? storedMode : fallback;
  const parsedSchema = storedSchema == null || storedSchema === "" ? null : Number.parseInt(storedSchema, 10);
  const hasValidSchema = Number.isFinite(parsedSchema) && parsedSchema > 0;
  try {
    if (modes.has(mode)) {
      localStorage.setItem(storageKey, mode);
      if (!hasValidSchema || parsedSchema <= schemaVersion) {
        localStorage.setItem(schemaKey, String(schemaVersion));
      }
    }
  } catch {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  root.dataset.themeMode = mode;
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement("meta");
    themeColorMeta.setAttribute("name", "theme-color");
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.setAttribute("content", resolved === "dark" ? darkColor : lightColor);
})();`;
}
