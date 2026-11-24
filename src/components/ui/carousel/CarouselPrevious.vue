<script setup lang="ts">
import type { WithClassAsProps } from './interface';

import type { ButtonVariants } from '@/components/ui/button';
import { ChevronLeftIcon } from '@lucide/vue';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCarousel } from './useCarousel';

const props = withDefaults(
	defineProps<
		{
			variant?: ButtonVariants['variant'];
			size?: ButtonVariants['size'];
			label?: string;
		} & WithClassAsProps
	>(),
	{
		variant: 'outline',
		size: 'icon-sm',
		label: 'Previous slide',
	},
);

const { orientation, canScrollPrev, scrollPrev } = useCarousel();
</script>

<template>
	<Button data-slot="carousel-previous" :disabled="!canScrollPrev" :class="cn('absolute touch-manipulation rounded-full active:not-aria-[haspopup]:translate-y-0', orientation === 'horizontal' ? 'inset-y-0 -start-12 my-auto' : 'inset-x-0 -top-12 mx-auto rotate-90', props.class)" :variant="variant" :size="size" @click="scrollPrev">
		<slot>
			<ChevronLeftIcon class="rtl:rotate-180" />
			<span class="sr-only">{{ label }}</span>
		</slot>
	</Button>
</template>
