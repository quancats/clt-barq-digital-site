import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Badge } from './Badge.vue';

export const badgeVariants = cva('h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none', {
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground [a]:hover:bg-primary-hover',
			secondary: 'bg-accent text-accent-foreground [a]:hover:bg-primary [a]:hover:text-primary-foreground',
			destructive: 'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:text-red-300 dark:bg-destructive/10 dark:[a]:hover:bg-destructive/15',
			outline: 'border-border text-foreground [a]:hover:bg-accent [a]:hover:text-accent-foreground',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary-link underline-offset-4 hover:text-primary-link-hover hover:underline',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});
export type BadgeVariants = VariantProps<typeof badgeVariants>;
