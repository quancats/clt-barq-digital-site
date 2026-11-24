<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { Loader2Icon } from '@lucide/vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class'];
		label?: string;
	}>(),
	{
		label: 'Loading',
	},
);
</script>

<template>
	<Loader2Icon role="status" :aria-label="label" :class="cn('size-4 animate-spin', props.class)" />
</template>
