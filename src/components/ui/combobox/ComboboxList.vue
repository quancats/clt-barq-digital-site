<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxContent, ComboboxPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>(), {
	position: 'popper',
	align: 'start',
	sideOffset: 4,
	bodyLock: false,
});
const emits = defineEmits<ComboboxContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<ComboboxPortal>
		<ComboboxContent data-slot="combobox-content" v-bind="{ ...$attrs, ...forwarded }" :class="cn('cn-menu-translucent group/combobox-content z-50 max-h-72 w-(--reka-combobox-trigger-width) min-w-36 origin-(--reka-combobox-content-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-[color-mix(in_oklab,var(--popover-foreground)_14%,var(--popover))] duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 rtl:data-[side=left]:translate-x-1 rtl:data-[side=right]:-translate-x-1', props.class)">
			<slot />
		</ComboboxContent>
	</ComboboxPortal>
</template>
