<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDownIcon, MenuIcon, XIcon } from '@lucide/vue';
import LanguageSwitcher from '@/components/islands/interactive/LanguageSwitcher.vue';
import RekaLocaleProvider from '@/components/islands/interactive/RekaLocaleProvider.vue';
import ThemeToggle from '@/components/islands/interactive/ThemeToggle.vue';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import type { ThemeMode } from '@/scripts/theme';

export interface HeaderChromeCopy {
	brand: string;
	navLabel: string;
	navMobileLabel: string;
	navMenu: string;
	navHome: string;
	navExplore: string;
	navArticles: string;
	navComponents: string;
	switchLanguage: string;
	languageNameAr: string;
	languageNameEn: string;
	themeLabel: string;
	themeLight: string;
	themeDark: string;
	themeAuto: string;
	ctaLabel: string;
	close: string;
}

export interface HeaderChromePaths {
	home: string;
	articles: string;
	components: string;
	cta: string;
	alternateHref: string;
}

const props = defineProps<{
	locale: Locale;
	defaultTheme: ThemeMode;
	copy: HeaderChromeCopy;
	paths: HeaderChromePaths;
	currentPath: string;
}>();

const mobileOpen = ref(false);
const exploreOpen = ref(false);

const brandClass = 'inline-flex h-10 items-center justify-center rounded-lg px-2.5 text-lg font-bold transition-colors hover:bg-muted hover:text-foreground';
const mobileNavLinkClass = 'min-h-11 rounded-lg wrap-anywhere px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted';
const mobileSubLinkClass = 'block min-h-11 rounded-lg wrap-anywhere px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

function normalizePath(path: string): string {
	return path.replace(/\/$/, '') || '/';
}

function isCurrent(href: string): boolean {
	return normalizePath(props.currentPath) === normalizePath(href);
}

const homeCurrent = computed(() => isCurrent(props.paths.home));
const articlesCurrent = computed(() => isCurrent(props.paths.articles));
const componentsCurrent = computed(() => isCurrent(props.paths.components));
const exploreCurrent = computed(() =>
	[props.paths.articles, props.paths.components].some((href) => {
		const section = normalizePath(href);
		const current = normalizePath(props.currentPath);
		return current === section || current.startsWith(section + '/');
	}),
);

function onMobileOpenChange(open: boolean) {
	mobileOpen.value = open;
	if (!open) {
		exploreOpen.value = false;
	}
}
</script>

<template>
	<RekaLocaleProvider :locale="locale">
		<div class="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 md:grid-cols-[1fr_auto_1fr] md:gap-x-4" data-header-chrome>
			<a :href="paths.home" :class="cn(brandClass, 'h-auto min-h-10 min-w-0 justify-self-start wrap-anywhere')" :aria-current="homeCurrent ? 'page' : undefined" data-astro-prefetch>
				{{ copy.brand }}
			</a>

			<NavigationMenu :aria-label="copy.navLabel" :viewport="false" class="col-span-2 hidden max-w-none justify-self-center md:col-span-1 md:col-start-2 md:row-start-1 md:flex">
				<NavigationMenuList class="flex-wrap justify-center gap-1">
					<NavigationMenuItem>
						<NavigationMenuLink :href="paths.home" class="min-h-10 px-2.5 py-2 font-medium" :active="homeCurrent" data-astro-prefetch>
							{{ copy.navHome }}
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem value="explore">
						<NavigationMenuTrigger class="h-10" :data-active="exploreCurrent ? '' : undefined">
							{{ copy.navExplore }}
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul class="grid w-48 gap-1 p-1">
								<li>
									<NavigationMenuLink :href="paths.articles" :active="articlesCurrent" data-astro-prefetch>
										{{ copy.navArticles }}
									</NavigationMenuLink>
								</li>
								<li>
									<NavigationMenuLink :href="paths.components" :active="componentsCurrent" data-astro-prefetch>
										{{ copy.navComponents }}
									</NavigationMenuLink>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div class="flex items-center justify-end gap-1.5 justify-self-end md:col-start-3 md:row-start-1">
				<LanguageSwitcher :locale="locale" :alternate-href="paths.alternateHref" :switch-language="copy.switchLanguage" :language-name-ar="copy.languageNameAr" :language-name-en="copy.languageNameEn" />

				<ThemeToggle :default-theme="defaultTheme" :theme-label="copy.themeLabel" :theme-light="copy.themeLight" :theme-dark="copy.themeDark" :theme-auto="copy.themeAuto" />

				<Button as="a" size="sm" class="hidden h-8 min-h-8 px-3 sm:inline-flex" :href="paths.cta" :aria-current="articlesCurrent ? 'page' : undefined" data-astro-prefetch>
					{{ copy.ctaLabel }}
				</Button>

				<Sheet :open="mobileOpen" @update:open="onMobileOpenChange">
					<SheetTrigger as-child>
						<Button variant="outline" size="icon" class="size-11 md:hidden" :aria-label="copy.navMenu" :aria-expanded="mobileOpen" :aria-controls="'site-mobile-nav'">
							<MenuIcon class="size-4" aria-hidden="true" />
						</Button>
					</SheetTrigger>
					<SheetContent side="end" :show-close-button="false" class="w-full max-w-sm gap-0 p-0">
						<SheetHeader class="shrink-0 flex-row items-center justify-between space-y-0 border-b border-border p-4 text-start">
							<a :href="paths.home" :class="cn(brandClass, 'text-base')" :aria-current="homeCurrent ? 'page' : undefined" data-astro-prefetch @click="onMobileOpenChange(false)">
								{{ copy.brand }}
							</a>
							<SheetClose as-child>
								<Button variant="ghost" size="icon" class="size-11" :aria-label="copy.close">
									<XIcon class="size-4" aria-hidden="true" />
								</Button>
							</SheetClose>
							<SheetTitle class="sr-only">
								{{ copy.navMobileLabel }}
							</SheetTitle>
						</SheetHeader>

						<nav :id="'site-mobile-nav'" :aria-label="copy.navMobileLabel" class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-4">
							<a :href="paths.home" :class="mobileNavLinkClass" :aria-current="homeCurrent ? 'page' : undefined" data-astro-prefetch @click="onMobileOpenChange(false)">
								{{ copy.navHome }}
							</a>

							<Collapsible v-model:open="exploreOpen">
								<CollapsibleTrigger :class="cn(mobileNavLinkClass, 'flex w-full items-center justify-between gap-2 data-[state=open]:bg-muted', exploreCurrent && 'bg-muted')">
									<span>{{ copy.navExplore }}</span>
									<ChevronDownIcon class="size-4 shrink-0 text-muted-foreground transition-transform duration-200" :class="exploreOpen ? 'rotate-180' : ''" aria-hidden="true" />
								</CollapsibleTrigger>
								<CollapsibleContent>
									<ul class="ms-3 mt-1 flex flex-col gap-0.5 border-s border-border ps-3">
										<li>
											<a :href="paths.articles" :class="mobileSubLinkClass" :aria-current="articlesCurrent ? 'page' : undefined" data-astro-prefetch @click="onMobileOpenChange(false)">
												{{ copy.navArticles }}
											</a>
										</li>
										<li>
											<a :href="paths.components" :class="mobileSubLinkClass" :aria-current="componentsCurrent ? 'page' : undefined" data-astro-prefetch @click="onMobileOpenChange(false)">
												{{ copy.navComponents }}
											</a>
										</li>
									</ul>
								</CollapsibleContent>
							</Collapsible>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</RekaLocaleProvider>
</template>
