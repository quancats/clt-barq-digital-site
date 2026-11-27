<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { AcceptableValue } from 'reka-ui';
import { MonitorIcon, MoonIcon, SunIcon } from '@lucide/vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { THEME_STORAGE_KEY, applyResolvedTheme, persistThemePreference, resolveStoredTheme, resolveThemeMode, themeModes, type ThemeMode } from '@/scripts/theme';

const iconTriggerClass = 'relative size-8 border-0 min-w-8 justify-center gap-0 p-0 pe-0 ps-0 data-[size=sm]:h-8 data-[size=sm]:w-8 data-[size=sm]:min-w-8 [&>svg:last-child]:hidden';

const props = defineProps<{
	defaultTheme: ThemeMode;
	themeLabel: string;
	themeLight: string;
	themeDark: string;
	themeAuto: string;
}>();

const selectedTheme = ref<ThemeMode>(props.defaultTheme);
let mediaQuery: MediaQueryList | undefined;

const themeOptions = computed(() =>
	themeModes.map((mode) => ({
		value: mode,
		label: mode === 'light' ? props.themeLight : mode === 'dark' ? props.themeDark : props.themeAuto,
	})),
);

function applyMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const resolved = resolveThemeMode(mode, prefersDark);
	applyResolvedTheme(resolved);
	document.documentElement.dataset.themeMode = mode;
}

function onThemeChange(value: AcceptableValue) {
	if (value !== 'light' && value !== 'dark' && value !== 'auto') return;
	selectedTheme.value = value;
	persistThemePreference(value, typeof localStorage === 'undefined' ? null : localStorage);
	applyMode(value);
}

function onSystemPreferenceChange() {
	if (selectedTheme.value === 'auto') {
		applyMode('auto');
	}
}

onMounted(() => {
	const fromHtml = document.documentElement.dataset.themeMode;
	selectedTheme.value = resolveStoredTheme(localStorage.getItem(THEME_STORAGE_KEY) ?? fromHtml, props.defaultTheme);
	persistThemePreference(selectedTheme.value, localStorage);
	applyMode(selectedTheme.value);

	mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	mediaQuery.addEventListener('change', onSystemPreferenceChange);
});

onUnmounted(() => {
	mediaQuery?.removeEventListener('change', onSystemPreferenceChange);
});
</script>

<template>
	<Select :model-value="selectedTheme" @update:model-value="onThemeChange">
		<SelectTrigger size="sm" :aria-label="themeLabel" :class="iconTriggerClass">
			<span class="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
				<SunIcon class="size-4" data-theme-icon="light" />
				<MoonIcon class="size-4" data-theme-icon="dark" />
				<MonitorIcon class="size-4" data-theme-icon="auto" />
			</span>
			<span class="sr-only">
				<SelectValue :placeholder="themeLabel" />
			</span>
		</SelectTrigger>
		<SelectContent align="end">
			<SelectGroup>
				<SelectItem v-for="option in themeOptions" :key="option.value" :value="option.value">
					{{ option.label }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>

<style scoped>
[data-theme-icon] {
	display: none;
}
html[data-theme-mode='light'] [data-theme-icon='light'],
html[data-theme-mode='dark'] [data-theme-icon='dark'],
html[data-theme-mode='auto'] [data-theme-icon='auto'] {
	display: block;
}
</style>
