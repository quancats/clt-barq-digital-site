<script setup lang="ts">
import type { SelectContentEmits, SelectContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';
import { SelectScrollDownButton, SelectScrollUpButton } from '.';

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(), {
	// Popper anchors to the trigger; item-aligned mis-offsets horizontally in RTL (check/value gap).
	position: 'popper',
	align: 'start',
	// Select is a listbox, not a modal — keep page scrollbar/layout stable (Reka default locks body).
	bodyLock: false,
});
const emits = defineEmits<SelectContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<SelectPortal>
		<SelectContent data-slot="select-content" :data-align-trigger="position === 'item-aligned'" v-bind="{ ...$attrs, ...forwarded }" :class="cn('cn-menu-translucent relative z-50 max-h-(--reka-select-content-available-height) min-w-36 origin-(--reka-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-[color-mix(in_oklab,var(--popover-foreground)_14%,var(--popover))] duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 rtl:data-[side=left]:translate-x-1 rtl:data-[side=right]:-translate-x-1', props.class)">
			<SelectScrollUpButton />
			<SelectViewport :data-position="position" :class="cn('data-[position=popper]:h-(--reka-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--reka-select-trigger-width)')">
				<slot />
			</SelectViewport>
			<SelectScrollDownButton />
		</SelectContent>
	</SelectPortal>
</template>
