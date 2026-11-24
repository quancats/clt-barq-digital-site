<script setup lang="ts">
import { ConfigProvider } from 'reka-ui';
import { getLocaleDirection, type Locale } from '@/i18n/config';

const props = defineProps<{
	locale: Locale;
}>();

const dir = getLocaleDirection(props.locale);
</script>

<template>
	<ConfigProvider :dir="dir" :locale="locale">
		<slot />
	</ConfigProvider>
</template>
