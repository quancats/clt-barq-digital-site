import { cva, type VariantProps } from 'class-variance-authority';

export const buttonLinkVariants = cva('inline-flex max-w-full items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm text-center font-medium wrap-anywhere whitespace-normal transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50', {
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			outline: 'border-border bg-background text-foreground hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
			ghost: 'text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
			link: 'text-primary-link underline-offset-4 hover:underline',
		},
		size: {
			default: 'min-h-8 px-3 py-1',
			sm: 'min-h-7 px-2.5 py-1 text-[0.8rem]',
			lg: 'min-h-9 px-4 py-1',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type ButtonLinkVariants = VariantProps<typeof buttonLinkVariants>;

export const badgeVariants = cva('inline-flex w-fit shrink-0 items-center justify-center rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap', {
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground',
			outline: 'border-border text-foreground',
			muted: 'bg-muted text-muted-foreground',
		},
	},
	defaultVariants: {
		variant: 'secondary',
	},
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export const cardVariants = cva('min-w-0 rounded-xl border border-border bg-card text-card-foreground ring-1 ring-foreground/10', {
	variants: {
		padding: {
			none: '',
			default: 'p-6',
			lg: 'p-8',
		},
	},
	defaultVariants: {
		padding: 'default',
	},
});

export type CardVariants = VariantProps<typeof cardVariants>;
