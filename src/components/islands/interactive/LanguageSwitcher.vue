<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import { LanguagesIcon } from '@lucide/vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Locale } from '@/i18n/config';

const iconTriggerClass = 'relative size-8 min-w-8 border-0 justify-center gap-0 p-0 pe-0 ps-0 data-[size=sm]:h-8 data-[size=sm]:w-8 data-[size=sm]:min-w-8 [&>svg:last-child]:hidden';

const props = defineProps<{
	locale: Locale;
	alternateHref: string;
	switchLanguage: string;
	languageNameAr: string;
	languageNameEn: string;
}>();

function onLanguageChange(value: AcceptableValue) {
	if (value !== 'ar' && value !== 'en') return;
	if (value === props.locale) return;
	window.location.assign(props.alternateHref);
}
</script>

<template>
	<Select :model-value="locale" @update:model-value="onLanguageChange">
		<SelectTrigger size="sm" :aria-label="switchLanguage" :class="iconTriggerClass">
			<span class="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
				<LanguagesIcon class="size-4" />
			</span>
			<span class="sr-only">
				<SelectValue :placeholder="switchLanguage" />
			</span>
		</SelectTrigger>
		<SelectContent align="end">
			<SelectGroup>
				<SelectItem value="ar">
					{{ languageNameAr }}
				</SelectItem>
				<SelectItem value="en">
					{{ languageNameEn }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>
