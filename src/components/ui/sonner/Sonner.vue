<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner';
import 'vue-sonner/style.css';

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { Toaster as Sonner } from 'vue-sonner';
import { cn } from '@/lib/utils';

const props = defineProps<ToasterProps>();
const delegatedProps = reactiveOmit(props, 'class', 'toastOptions');
</script>

<template>
	<Sonner
		:class="cn('toaster barq-toaster group', props.class)"
		:style="{
			'--normal-bg': 'var(--popover)',
			'--normal-text': 'var(--popover-foreground)',
			'--normal-border': 'var(--section-rule)',
			'--normal-bg-hover': 'var(--accent)',
			'--normal-border-hover': 'var(--field-border)',
			'--border-radius': 'var(--radius)',
			'--gray2': 'var(--accent)',
			'--gray3': 'var(--section-rule)',
			'--gray4': 'var(--field-border)',
			'--gray5': 'var(--field-border)',
			'--gray12': 'var(--popover-foreground)',
		}"
		:toast-options="
			props.toastOptions ?? {
				classes: {
					toast: 'rounded-2xl',
				},
			}
		"
		v-bind="delegatedProps">
		<template #success-icon>
			<CircleCheckIcon class="size-4" />
		</template>
		<template #info-icon>
			<InfoIcon class="size-4" />
		</template>
		<template #warning-icon>
			<TriangleAlertIcon class="size-4" />
		</template>
		<template #error-icon>
			<OctagonXIcon class="size-4" />
		</template>
		<template #loading-icon>
			<div>
				<Loader2Icon class="size-4 animate-spin" />
			</div>
		</template>
		<template #close-icon>
			<XIcon class="size-4" />
		</template>
	</Sonner>
</template>

<style>
.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'] {
	--toast-accent: var(--primary-link);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'][data-type='success'] {
	--toast-accent: var(--success);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'][data-type='warning'] {
	--toast-accent: color-mix(in oklab, var(--warning) 80%, var(--foreground));
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'][data-type='error'] {
	--toast-accent: var(--destructive);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'][data-rich-colors='true'] {
	border-color: color-mix(in oklab, var(--toast-accent) 25%, var(--section-rule));
	background: color-mix(in oklab, var(--toast-accent) 5%, var(--popover));
	color: var(--popover-foreground);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'] [data-icon] {
	color: var(--toast-accent);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'] [data-description] {
	color: var(--muted-foreground);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'] [data-close-button] {
	inline-size: 1.75rem;
	block-size: 1.75rem;
	border-color: var(--field-border);
	background: var(--popover);
	color: var(--popover-foreground);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'] [data-close-button]:is(:hover, :focus-visible) {
	background: var(--accent);
	color: var(--accent-foreground);
}

.barq-toaster[data-sonner-toaster] [data-sonner-toast][data-styled='true'] [data-close-button]:focus-visible {
	outline: 2px solid var(--ring);
	outline-offset: 2px;
}
</style>
