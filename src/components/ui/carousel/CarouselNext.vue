<script setup lang="ts">
import type { WithClassAsProps } from './interface';

import type { ButtonVariants } from '@/components/ui/button';
import { ChevronRightIcon } from '@lucide/vue';
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
		label: 'Next slide',
	},
);

const { orientation, canScrollNext, scrollNext } = useCarousel();
</script>

<template>
	<Button data-slot="carousel-next" :disabled="!canScrollNext" :class="cn('absolute touch-manipulation rounded-full active:not-aria-[haspopup]:translate-y-0', orientation === 'horizontal' ? 'inset-y-0 -end-12 my-auto' : 'inset-x-0 -bottom-12 mx-auto rotate-90', props.class)" :variant="variant" :size="size" @click="scrollNext">
		<slot>
			<ChevronRightIcon class="rtl:rotate-180" />
			<span class="sr-only">{{ label }}</span>
		</slot>
	</Button>
</template>
