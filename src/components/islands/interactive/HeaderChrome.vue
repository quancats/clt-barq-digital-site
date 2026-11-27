<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDownIcon, MenuIcon, XIcon } from '@lucide/vue';
import LanguageSwitcher from '@/components/islands/interactive/LanguageSwitcher.vue';
import RekaLocaleProvider from '@/components/islands/interactive/RekaLocaleProvider.vue';
import ThemeToggle from '@/components/islands/interactive/ThemeToggle.vue';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Locale } from '@/i18n/config';
import type { getDictionary } from '@/i18n/helpers';
import type { ThemeMode } from '@/scripts/theme';

type Link = { href: string; title: string };
type Menu = { key: string; title: string; overview?: Link; links: Link[] };
type Dictionary = ReturnType<typeof getDictionary>;

const props = defineProps<{
	locale: Locale;
	defaultTheme: ThemeMode;
	brand: { src: string; width: number; height: number; label: string };
	home: Link;
	serviceRequest?: Link | undefined;
	menus: Menu[];
	alternatePath?: string | undefined;
	currentPath: string;
	common: Pick<Dictionary['common'], 'switch_language' | 'translation_unavailable' | 'language_name_ar' | 'language_name_en' | 'theme_label' | 'theme_light' | 'theme_dark' | 'theme_auto' | 'close'>;
	layout: Pick<Dictionary['layout'], 'nav_label' | 'nav_mobile_label' | 'nav_menu'>;
}>();

const mobileOpen = ref(false);
const mobileSection = ref<string>();
const normalize = (href: string) => href.replace(/\/$/, '') || '/';
const current = computed(() => normalize(props.currentPath));
const isCurrent = (href: string) => normalize(href) === current.value;
const isSection = (menu: Menu) => menu.links.some(({ href }) => isCurrent(href) || current.value.startsWith(normalize(href) + '/'));
const sectionLabel = computed(() => (props.locale === 'ar' ? 'عرض القسم' : 'View section'));

function onMobileOpenChange(open: boolean) {
	mobileOpen.value = open;
	if (!open) mobileSection.value = undefined;
}

const row = 'mx-auto w-full max-w-7xl px-4 sm:px-6';
const linkClass = 'flex min-h-11 items-center rounded-md px-3 text-sm font-medium wrap-anywhere hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-2 aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground';
const desktopLinkClass = 'header-nav-item relative h-11 rounded-md px-2 font-medium xl:px-3';
</script>

<template>
	<RekaLocaleProvider :locale="locale">
		<div data-header-chrome class="header-surface">
			<div :class="[row, 'header-grid']">
				<a :href="home.href" :aria-current="isCurrent(home.href) ? 'page' : undefined" class="header-brand inline-flex min-h-11 shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4" data-astro-prefetch>
					<img :src="brand.src" :width="brand.width" :height="brand.height" :alt="brand.label" :class="['shrink-0', locale === 'en' ? 'w-12 sm:w-16' : 'w-9 sm:w-10']" />
				</a>

				<NavigationMenu :aria-label="layout.nav_label" :viewport="false" class="header-directory hidden max-w-none min-w-0 justify-center min-[70rem]:flex">
					<NavigationMenuList class="flex-none flex-nowrap justify-center gap-0.5 xl:gap-1">
						<NavigationMenuItem>
							<NavigationMenuLink :href="home.href" :active="isCurrent(home.href)" :class="desktopLinkClass" data-astro-prefetch>{{ home.title }}</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem v-for="menu in menus" :key="menu.key" :value="menu.key">
							<template v-if="menu.links.length > 1">
								<NavigationMenuTrigger :class="desktopLinkClass" :data-active="isSection(menu) ? '' : undefined">{{ menu.title }}</NavigationMenuTrigger>
								<NavigationMenuContent :class="{ 'header-dropdown-centered': menu.links.length <= 5 }">
									<div class="header-menu-panel" :class="{ 'header-menu-panel-wide': menu.links.length > 5 }">
										<div class="header-menu-heading">
											<p class="min-w-0 font-semibold wrap-anywhere">{{ menu.title }}</p>
											<NavigationMenuLink v-if="menu.overview" :href="menu.overview.href" :active="isCurrent(menu.overview.href)" class="header-menu-overview" data-astro-prefetch>
												{{ sectionLabel }}<span class="sr-only"> · {{ menu.title }}</span>
											</NavigationMenuLink>
										</div>
										<ul class="header-menu-links" :class="{ 'header-menu-links-wide': menu.links.length > 5 }">
											<li v-for="link in menu.links.slice(menu.overview ? 1 : 0)" :key="link.href" class="min-w-0">
												<NavigationMenuLink :href="link.href" :active="isCurrent(link.href)" class="header-menu-link min-h-11 wrap-anywhere" data-astro-prefetch>{{ link.title }}</NavigationMenuLink>
											</li>
										</ul>
									</div>
								</NavigationMenuContent>
							</template>
							<NavigationMenuLink v-else-if="menu.links[0]" :href="menu.links[0].href" :active="isCurrent(menu.links[0].href)" :class="desktopLinkClass" data-astro-prefetch>{{ menu.title }}</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<div class="header-actions flex min-w-0 items-center justify-end gap-1 sm:gap-2 min-[70rem]:border-s min-[70rem]:ps-3">
					<div class="header-tools flex h-9 items-center gap-0.5 rounded-md border px-0.5">
						<LanguageSwitcher v-if="alternatePath" :locale="locale" :alternate-href="alternatePath" :switch-language="common.switch_language" :language-name-ar="common.language_name_ar" :language-name-en="common.language_name_en" />
						<span v-else class="sr-only">{{ common.translation_unavailable }}</span>
						<ThemeToggle :default-theme="defaultTheme" :theme-label="common.theme_label" :theme-light="common.theme_light" :theme-dark="common.theme_dark" :theme-auto="common.theme_auto" />
					</div>
					<Button v-if="serviceRequest" as="a" size="lg" class="brand-request-action header-request px-2.5 sm:px-4" :href="serviceRequest.href" :aria-current="isCurrent(serviceRequest.href) ? 'page' : undefined" data-astro-prefetch>{{ serviceRequest.title }}</Button>

					<Sheet :open="mobileOpen" @update:open="onMobileOpenChange">
						<SheetTrigger as-child>
							<Button variant="outline" size="icon-lg" class="header-menu-toggle min-[70rem]:hidden" :aria-label="layout.nav_menu">
								<MenuIcon class="size-5" aria-hidden="true" />
							</Button>
						</SheetTrigger>
						<SheetContent side="end" :show-close-button="false" class="w-full max-w-sm gap-0 bg-[var(--brand-frame-surface)] p-0">
							<SheetHeader class="flex-row items-center justify-between border-b border-border p-4 text-start">
								<SheetTitle>{{ brand.label }}</SheetTitle>
								<SheetDescription class="sr-only">{{ layout.nav_mobile_label }}</SheetDescription>
								<SheetClose as-child>
									<Button variant="ghost" size="icon" class="size-11" :aria-label="common.close"><XIcon class="size-5" aria-hidden="true" /></Button>
								</SheetClose>
							</SheetHeader>
							<nav :aria-label="layout.nav_mobile_label" class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-3">
								<a :href="home.href" :class="linkClass" :aria-current="isCurrent(home.href) ? 'page' : undefined" @click="onMobileOpenChange(false)">{{ home.title }}</a>
								<template v-for="menu in menus" :key="menu.key">
									<Collapsible v-if="menu.links.length > 1" :open="mobileSection === menu.key" @update:open="mobileSection = $event ? menu.key : undefined">
										<CollapsibleTrigger :class="[linkClass, 'w-full justify-between gap-2 text-start data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', isSection(menu) && 'text-primary-link']">
											{{ menu.title }}
											<ChevronDownIcon class="size-4 shrink-0" :class="{ 'rotate-180': mobileSection === menu.key }" aria-hidden="true" />
										</CollapsibleTrigger>
										<CollapsibleContent>
											<ul class="ms-3 border-s border-border ps-2">
												<li v-if="menu.overview">
													<a :href="menu.overview.href" :class="[linkClass, 'font-semibold text-primary-link']" :aria-current="isCurrent(menu.overview.href) ? 'page' : undefined" @click="onMobileOpenChange(false)"
														>{{ sectionLabel }}<span class="sr-only"> · {{ menu.title }}</span></a
													>
												</li>
												<li v-for="link in menu.links.slice(menu.overview ? 1 : 0)" :key="link.href">
													<a :href="link.href" :class="linkClass" :aria-current="isCurrent(link.href) ? 'page' : undefined" @click="onMobileOpenChange(false)">{{ link.title }}</a>
												</li>
											</ul>
										</CollapsibleContent>
									</Collapsible>
									<a v-else-if="menu.links[0]" :href="menu.links[0].href" :class="linkClass" :aria-current="isCurrent(menu.links[0].href) ? 'page' : undefined" @click="onMobileOpenChange(false)">{{ menu.title }}</a>
								</template>
							</nav>
							<div v-if="serviceRequest" class="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
								<Button as="a" size="lg" class="brand-request-action w-full" :href="serviceRequest.href" :aria-current="isCurrent(serviceRequest.href) ? 'page' : undefined" @click="onMobileOpenChange(false)">{{ serviceRequest.title }}</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	</RekaLocaleProvider>
</template>

<style scoped>
.header-surface {
	--header-text: var(--color-slate-800);
	--header-accent: var(--primary-link);
	--header-line: var(--border);
	--header-interactive: var(--accent);
	background: var(--brand-frame-surface);
	color: var(--header-text);
}

.header-surface:where(.dark *) {
	--header-text: var(--brand-on-navy);
	--header-accent: var(--brand-accent);
	--header-line: var(--brand-navy-border);
	--header-interactive: var(--accent);
}

.header-brand {
	padding-inline: 0.25rem;
}

.header-brand img:where(.dark *) {
	filter: brightness(1.24);
}

.header-grid {
	display: grid;
	min-height: 4.5rem;
	grid-template-columns: auto minmax(0, 1fr);
	align-items: center;
	gap: 0.5rem;
	padding-block: 0.5rem;
}

@media (min-width: 70rem) {
	.header-grid {
		grid-template-columns: auto minmax(0, 1fr) auto;
		column-gap: clamp(0.75rem, 1.8vi, 1.75rem);
	}
}

.header-directory :deep(.header-nav-item) {
	color: var(--header-text);
}

.header-directory :deep(.header-nav-item:is(:hover, :focus, [data-state='open'], [data-active])) {
	color: var(--header-accent);
	background: var(--header-interactive);
}

.header-directory :deep(.header-nav-item[data-active]::after) {
	position: absolute;
	inset-inline: 0.65rem;
	inset-block-end: 0.2rem;
	height: 2px;
	border-radius: 1px;
	background: var(--header-accent);
	content: '';
}

@media (70rem <= width < 72rem) {
	.header-directory :deep([data-slot='navigation-menu-list']) {
		gap: 0;
	}

	.header-directory :deep(.header-nav-item) {
		padding-inline: 0.25rem;
	}
}

.header-actions,
.header-tools,
.header-menu-toggle {
	border-color: var(--header-line);
}

.header-tools :deep([data-slot='select-trigger']),
.header-menu-toggle {
	background: transparent;
	color: var(--header-text);
}

.header-tools :deep([data-slot='select-trigger']:is(:hover, :focus-visible, [data-state='open'])),
.header-menu-toggle:is(:hover, :focus-visible, [data-state='open']) {
	background: var(--header-interactive);
	color: var(--header-accent);
}

.header-directory :deep([data-slot='navigation-menu-content']) {
	z-index: 1;
	margin-block-start: 0;
	background: var(--brand-frame-surface);
	color: var(--foreground);
	border: 1px solid var(--header-line);
	border-radius: var(--radius-lg);
	animation: none;
}

.header-directory :deep(.header-dropdown-centered) {
	inset-inline: auto;
	left: 50%;
	translate: -50% 0;
}

.header-menu-panel {
	width: 20rem;
	max-width: 82vw;
	max-height: 58dvh;
	overflow-y: auto;
	overscroll-behavior: contain;
}

.header-menu-panel-wide {
	width: 35rem;
}

.header-menu-heading {
	display: flex;
	min-height: 3rem;
	align-items: center;
	justify-content: space-between;
	gap: 0.6rem;
	padding: 0.25rem 0.75rem;
	border-block-end: 1px solid var(--border);
}

.header-menu-overview {
	width: auto;
	min-height: 2.75rem;
	flex: none;
	color: var(--header-accent);
	font-weight: 600;
}

.header-menu-links {
	display: grid;
	gap: 0.15rem 0.45rem;
	padding: 0.35rem;
}

.header-menu-links-wide {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.header-menu-link:is(:hover, :focus-visible, [data-active]),
.header-menu-overview:is(:hover, :focus-visible, [data-active]) {
	background: var(--header-interactive);
	color: var(--header-accent);
}
</style>
