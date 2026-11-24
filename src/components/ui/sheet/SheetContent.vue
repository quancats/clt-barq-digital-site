<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';
import { XIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { DialogClose, DialogContent, DialogPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SheetOverlay from './SheetOverlay.vue';

interface SheetContentProps extends DialogContentProps {
	class?: HTMLAttributes['class'];
	/** Physical sides, or logical `start`/`end` (preferred for RTL). */
	side?: 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
	showCloseButton?: boolean;
	closeLabel?: string;
}

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(defineProps<SheetContentProps>(), {
	side: 'end',
	showCloseButton: true,
	closeLabel: 'Close',
});
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'side', 'showCloseButton', 'closeLabel');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<DialogPortal>
		<SheetOverlay />
		<DialogContent data-slot="sheet-content" :data-side="side" :class="cn('fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg duration-200 ease-in-out motion-safe:transition', 'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t', 'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b', 'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:sm:max-w-sm', 'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:sm:max-w-sm', 'data-[side=start]:inset-y-0 data-[side=start]:start-0 data-[side=start]:h-full data-[side=start]:w-3/4 data-[side=start]:border-e data-[side=start]:sm:max-w-sm', 'data-[side=end]:inset-y-0 data-[side=end]:end-0 data-[side=end]:h-full data-[side=end]:w-3/4 data-[side=end]:border-s data-[side=end]:sm:max-w-sm', 'data-open:fade-in-0 motion-safe:data-open:animate-in data-closed:fade-out-0 motion-safe:data-closed:animate-out', 'data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=bottom]:data-closed:slide-out-to-bottom-10', 'data-[side=top]:data-open:slide-in-from-top-10 data-[side=top]:data-closed:slide-out-to-top-10', 'data-[side=left]:data-open:slide-in-from-left-10 data-[side=left]:data-closed:slide-out-to-left-10', 'data-[side=right]:data-open:slide-in-from-right-10 data-[side=right]:data-closed:slide-out-to-right-10', 'data-[side=start]:data-open:slide-in-from-start-10 data-[side=start]:data-closed:slide-out-to-start-10', 'data-[side=end]:data-open:slide-in-from-end-10 data-[side=end]:data-closed:slide-out-to-end-10', props.class)" v-bind="{ ...$attrs, ...forwarded }">
			<slot />

			<DialogClose v-if="showCloseButton" data-slot="sheet-close" as-child>
				<Button variant="ghost" class="absolute end-3 top-3" size="icon-sm">
					<XIcon />
					<span class="sr-only">{{ closeLabel }}</span>
				</Button>
			</DialogClose>
		</DialogContent>
	</DialogPortal>
</template>
