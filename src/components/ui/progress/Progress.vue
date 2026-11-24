<script setup lang="ts">
import type { ProgressRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<ProgressRootProps & { class?: HTMLAttributes['class'] }>(), {
	modelValue: 0,
});

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
	<ProgressRoot data-slot="progress" v-bind="delegatedProps" :class="cn('relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted', props.class)">
		<ProgressIndicator data-slot="progress-indicator" class="size-full flex-1 origin-left bg-primary transition-all rtl:origin-right" :style="{ transform: `scaleX(${(props.modelValue ?? 0) / 100})` }" />
	</ProgressRoot>
</template>
