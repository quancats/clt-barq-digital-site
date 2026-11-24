<script setup lang="ts">
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { AlertCircleIcon, CheckIcon, ChevronDownIcon, CircleIcon, DotIcon, InfoIcon, MailIcon, SearchIcon, SettingsIcon } from '@lucide/vue';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxTrigger, ComboboxViewport } from '@/components/ui/combobox';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import RekaLocaleProvider from '@/components/islands/interactive/RekaLocaleProvider.vue';
import { catalogCategories, catalogComponents, getCatalogComponentsByCategory } from '@/lib/ui/componentCatalog';
import type { Locale } from '@/i18n/config';

interface CatalogDemoCopy {
	accordion_q1: string;
	accordion_a1: string;
	accordion_q2: string;
	accordion_a2: string;
	alert_info_title: string;
	alert_info_body: string;
	alert_destructive_title: string;
	alert_destructive_body: string;
	alert_dialog_title: string;
	alert_dialog_body: string;
	avatar_alt: string;
	variant_default: string;
	variant_primary: string;
	variant_secondary: string;
	variant_outline: string;
	variant_ghost: string;
	variant_destructive: string;
	card_title: string;
	card_description: string;
	card_body: string;
	card_action: string;
	carousel_slide: string;
	collapsible_title: string;
	collapsible_hide: string;
	collapsible_show: string;
	collapsible_body: string;
	empty_title: string;
	empty_description: string;
	empty_action: string;
	field_label: string;
	field_placeholder: string;
	field_description: string;
	label_standalone: string;
	label_input_placeholder: string;
	input_placeholder: string;
	input_aria: string;
	textarea_placeholder: string;
	textarea_aria: string;
	native_select_label: string;
	native_select_editor: string;
	native_select_reviewer: string;
	native_select_admin: string;
	number_field_label: string;
	input_group_placeholder: string;
	input_group_aria: string;
	select_aria: string;
	select_placeholder: string;
	combobox_aria: string;
	combobox_placeholder: string;
	combobox_empty: string;
	combobox_option_sa: string;
	combobox_option_ae: string;
	combobox_option_eg: string;
	checkbox_label: string;
	radio_label: string;
	radio_starter: string;
	radio_pro: string;
	radio_team: string;
	switch_label: string;
	form_helper: string;
	form_name_error: string;
	form_email_error: string;
	form_message_error: string;
	item_title: string;
	item_description: string;
	nav_menu_aria: string;
	nav_menu_docs: string;
	pagination_aria: string;
	spinner_state: string;
	sheet_title: string;
	sheet_description: string;
	sheet_body: string;
	stepper_step1_title: string;
	stepper_step1_description: string;
	stepper_step2_title: string;
	stepper_step2_description: string;
	stepper_step3_title: string;
	stepper_step3_description: string;
	stepper_status: string;
	tabs_overview: string;
	tabs_usage: string;
	tabs_overview_body: string;
	tabs_usage_body: string;
	toast_title: string;
	toast_description: string;
	tooltip_trigger: string;
	tooltip_content: string;
}

interface CatalogCopy {
	page_intro: string;
	category_display: string;
	category_disclosure: string;
	category_forms: string;
	category_navigation: string;
	category_feedback: string;
	demo_form_name: string;
	demo_form_email: string;
	demo_form_message: string;
	demo_form_submit: string;
	demo_form_success: string;
	demo_toast: string;
	demo_open_sheet: string;
	demo_open_dialog: string;
	demo_confirm: string;
	demo_cancel: string;
	close: string;
	loading: string;
	more_pages: string;
	previous: string;
	next: string;
	previous_slide: string;
	next_slide: string;
	demo: CatalogDemoCopy;
	components: Record<string, { name: string; description: string }>;
}

const props = defineProps<{
	locale: Locale;
	copy: CatalogCopy;
}>();

const categoryLabels: Record<(typeof catalogCategories)[number], string> = {
	display: props.copy.category_display,
	disclosure: props.copy.category_disclosure,
	forms: props.copy.category_forms,
	navigation: props.copy.category_navigation,
	feedback: props.copy.category_feedback,
};

const page = ref(2);
const step = ref(1);
const quantity = ref(2);
const progress = ref(62);
const collapsibleOpen = ref(false);
const newsletterOptIn = ref(true);
const plan = ref('pro');
const notificationsEnabled = ref(false);

const catalogAvatarUrl = 'https://github.com/shadcn.png';

const comboboxValue = ref('sa');

const comboboxOptions = computed(() => [
	{ value: 'sa', label: props.copy.demo.combobox_option_sa },
	{ value: 'ae', label: props.copy.demo.combobox_option_ae },
	{ value: 'eg', label: props.copy.demo.combobox_option_eg },
]);

const selectedComboboxOption = computed(() => comboboxOptions.value.find((option) => option.value === comboboxValue.value));
const comboboxTriggerText = computed(() => selectedComboboxOption.value?.label || props.copy.demo.combobox_placeholder);

const stepperSteps = computed(() => [
	{ step: 1, title: props.copy.demo.stepper_step1_title, description: props.copy.demo.stepper_step1_description },
	{ step: 2, title: props.copy.demo.stepper_step2_title, description: props.copy.demo.stepper_step2_description },
	{ step: 3, title: props.copy.demo.stepper_step3_title, description: props.copy.demo.stepper_step3_description },
]);

function formatCopy(template: string, values: Record<string, string | number>) {
	return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
}

const { handleSubmit, resetForm } = useForm({
	initialValues: { name: '', email: '', message: '' },
	validationSchema: {
		name: (value: string) => value.length >= 2 || props.copy.demo.form_name_error,
		email: (value: string) => /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value) || props.copy.demo.form_email_error,
		message: (value: string) => value.length >= 8 || props.copy.demo.form_message_error,
	},
});

const onSubmit = handleSubmit(() => {
	toast.success(props.copy.demo_form_success);
	resetForm();
});

const componentCount = computed(() => catalogComponents.length);
</script>

<template>
	<RekaLocaleProvider :locale="locale">
		<div class="space-y-10">
			<Toaster rich-colors close-button position="top-center" />

			<p class="text-base text-muted-foreground">
				{{ copy.page_intro }}
				<span class="font-medium text-foreground">({{ componentCount }})</span>
			</p>

			<section v-for="category in catalogCategories" :key="category" class="space-y-4">
				<h2 class="text-2xl font-semibold tracking-tight">{{ categoryLabels[category] }}</h2>
				<div class="grid grid-cols-1 gap-4">
					<article v-for="component in getCatalogComponentsByCategory(category)" :id="component.id" :key="component.id" class="rounded-xl border border-border bg-card p-5 text-card-foreground ring-1 ring-foreground/10" :data-catalog-component="component.id">
						<header class="mb-4 space-y-1">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="text-lg font-semibold">{{ copy.components[component.id]?.name }}</h3>
								<Badge variant="secondary">{{ component.id }}</Badge>
							</div>
							<p class="text-sm text-muted-foreground">{{ copy.components[component.id]?.description }}</p>
						</header>

						<!-- Accordion -->
						<div v-if="component.id === 'accordion'" class="max-w-xl">
							<Accordion type="single" collapsible default-value="item-1">
								<AccordionItem value="item-1">
									<AccordionTrigger>{{ copy.demo.accordion_q1 }}</AccordionTrigger>
									<AccordionContent>{{ copy.demo.accordion_a1 }}</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2">
									<AccordionTrigger>{{ copy.demo.accordion_q2 }}</AccordionTrigger>
									<AccordionContent>{{ copy.demo.accordion_a2 }}</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>

						<!-- Alert -->
						<div v-else-if="component.id === 'alert'" class="max-w-xl space-y-3">
							<Alert>
								<InfoIcon />
								<AlertTitle>{{ copy.demo.alert_info_title }}</AlertTitle>
								<AlertDescription>{{ copy.demo.alert_info_body }}</AlertDescription>
							</Alert>
							<Alert variant="destructive">
								<AlertCircleIcon />
								<AlertTitle>{{ copy.demo.alert_destructive_title }}</AlertTitle>
								<AlertDescription>{{ copy.demo.alert_destructive_body }}</AlertDescription>
							</Alert>
						</div>

						<!-- Alert Dialog -->
						<div v-else-if="component.id === 'alert-dialog'">
							<AlertDialog>
								<AlertDialogTrigger as-child>
									<Button variant="outline">{{ copy.demo_open_dialog }}</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>{{ copy.demo.alert_dialog_title }}</AlertDialogTitle>
										<AlertDialogDescription>{{ copy.demo.alert_dialog_body }}</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>{{ copy.demo_cancel }}</AlertDialogCancel>
										<AlertDialogAction>{{ copy.demo_confirm }}</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>

						<!-- Aspect Ratio -->
						<div v-else-if="component.id === 'aspect-ratio'" class="max-w-md overflow-hidden rounded-xl border">
							<AspectRatio :ratio="16 / 9">
								<div class="flex size-full items-center justify-center bg-muted text-sm text-foreground">16:9</div>
							</AspectRatio>
						</div>

						<!-- Avatar -->
						<div v-else-if="component.id === 'avatar'" class="flex items-center gap-3">
							<Avatar>
								<AvatarImage :src="catalogAvatarUrl" :alt="copy.demo.avatar_alt" />
								<AvatarFallback>SC</AvatarFallback>
							</Avatar>
							<Avatar>
								<AvatarFallback>AR</AvatarFallback>
							</Avatar>
						</div>

						<!-- Badge -->
						<div v-else-if="component.id === 'badge'" class="flex flex-wrap gap-2">
							<Badge>{{ copy.demo.variant_default }}</Badge>
							<Badge variant="secondary">{{ copy.demo.variant_secondary }}</Badge>
							<Badge variant="outline">{{ copy.demo.variant_outline }}</Badge>
							<Badge variant="destructive">{{ copy.demo.variant_destructive }}</Badge>
						</div>

						<!-- Button -->
						<div v-else-if="component.id === 'button'" class="flex flex-wrap gap-2">
							<Button>{{ copy.demo.variant_primary }}</Button>
							<Button variant="secondary">{{ copy.demo.variant_secondary }}</Button>
							<Button variant="outline">{{ copy.demo.variant_outline }}</Button>
							<Button variant="ghost">{{ copy.demo.variant_ghost }}</Button>
							<Button variant="destructive">{{ copy.demo.variant_destructive }}</Button>
						</div>

						<!-- Card -->
						<div v-else-if="component.id === 'card'" class="max-w-md">
							<Card>
								<CardHeader>
									<CardTitle>{{ copy.demo.card_title }}</CardTitle>
									<CardDescription>{{ copy.demo.card_description }}</CardDescription>
								</CardHeader>
								<CardContent class="text-sm">{{ copy.demo.card_body }}</CardContent>
								<CardFooter>
									<Button size="sm">{{ copy.demo.card_action }}</Button>
								</CardFooter>
							</Card>
						</div>

						<!-- Carousel -->
						<div v-else-if="component.id === 'carousel'" class="mx-auto w-full max-w-md px-10">
							<Carousel>
								<CarouselContent>
									<CarouselItem v-for="slide in 3" :key="slide">
										<div class="flex h-36 items-center justify-center rounded-xl border bg-muted text-lg font-medium">
											{{ formatCopy(copy.demo.carousel_slide, { n: slide }) }}
										</div>
									</CarouselItem>
								</CarouselContent>
								<CarouselPrevious :label="copy.previous_slide" />
								<CarouselNext :label="copy.next_slide" />
							</Carousel>
						</div>

						<!-- Collapsible -->
						<div v-else-if="component.id === 'collapsible'" class="max-w-md space-y-2">
							<Collapsible v-model:open="collapsibleOpen">
								<div class="flex items-center justify-between gap-2">
									<p class="text-sm font-medium">{{ copy.demo.collapsible_title }}</p>
									<CollapsibleTrigger as-child>
										<Button variant="outline" size="sm">{{ collapsibleOpen ? copy.demo.collapsible_hide : copy.demo.collapsible_show }}</Button>
									</CollapsibleTrigger>
								</div>
								<CollapsibleContent class="pt-2 text-sm text-muted-foreground">{{ copy.demo.collapsible_body }}</CollapsibleContent>
							</Collapsible>
						</div>

						<!-- Empty -->
						<div v-else-if="component.id === 'empty'" class="max-w-lg rounded-xl border">
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<SearchIcon />
									</EmptyMedia>
									<EmptyTitle>{{ copy.demo.empty_title }}</EmptyTitle>
									<EmptyDescription>{{ copy.demo.empty_description }}</EmptyDescription>
								</EmptyHeader>
								<EmptyContent>
									<Button size="sm">{{ copy.demo.empty_action }}</Button>
								</EmptyContent>
							</Empty>
						</div>

						<!-- Field / Label / Input / Textarea / Native Select / Number Field / Input Group / Form -->
						<div v-else-if="component.id === 'field'" class="max-w-md">
							<FieldGroup>
								<Field>
									<FieldLabel for="demo-field">{{ copy.demo.field_label }}</FieldLabel>
									<Input id="demo-field" :placeholder="copy.demo.field_placeholder" />
									<FieldDescription>{{ copy.demo.field_description }}</FieldDescription>
								</Field>
							</FieldGroup>
						</div>

						<div v-else-if="component.id === 'label'" class="max-w-xs space-y-2">
							<Label for="standalone-label">{{ copy.demo.label_standalone }}</Label>
							<Input id="standalone-label" :placeholder="copy.demo.label_input_placeholder" />
						</div>

						<div v-else-if="component.id === 'input'" class="max-w-xs">
							<Input type="text" :placeholder="copy.demo.input_placeholder" :aria-label="copy.demo.input_aria" />
						</div>

						<div v-else-if="component.id === 'textarea'" class="max-w-md">
							<Textarea :placeholder="copy.demo.textarea_placeholder" :aria-label="copy.demo.textarea_aria" />
						</div>

						<div v-else-if="component.id === 'native-select'" class="max-w-xs">
							<Label for="native-role" class="mb-2 block">{{ copy.demo.native_select_label }}</Label>
							<NativeSelect id="native-role">
								<NativeSelectOption value="editor">{{ copy.demo.native_select_editor }}</NativeSelectOption>
								<NativeSelectOption value="reviewer">{{ copy.demo.native_select_reviewer }}</NativeSelectOption>
								<NativeSelectOption value="admin">{{ copy.demo.native_select_admin }}</NativeSelectOption>
							</NativeSelect>
						</div>

						<div v-else-if="component.id === 'number-field'" class="max-w-xs">
							<Label for="demo-quantity" class="mb-2 block">{{ copy.demo.number_field_label }}</Label>
							<NumberField v-model="quantity" :min="0" :max="20">
								<NumberFieldContent>
									<NumberFieldDecrement />
									<NumberFieldInput id="demo-quantity" />
									<NumberFieldIncrement />
								</NumberFieldContent>
							</NumberField>
						</div>

						<div v-else-if="component.id === 'input-group'" class="max-w-md">
							<InputGroup>
								<InputGroupAddon>
									<InputGroupText><MailIcon class="size-4" /></InputGroupText>
								</InputGroupAddon>
								<InputGroupInput type="email" :placeholder="copy.demo.input_group_placeholder" :aria-label="copy.demo.input_group_aria" />
							</InputGroup>
						</div>

						<div v-else-if="component.id === 'select'" class="max-w-xs">
							<Select default-value="astro">
								<SelectTrigger :aria-label="copy.demo.select_aria">
									<SelectValue :placeholder="copy.demo.select_placeholder" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="astro">Astro</SelectItem>
										<SelectItem value="vue">Vue</SelectItem>
										<SelectItem value="nuxt">Nuxt</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div v-else-if="component.id === 'combobox'" class="max-w-xs">
							<Combobox v-model="comboboxValue" :open-on-click="true">
								<ComboboxAnchor>
									<ComboboxTrigger type="button" :aria-label="`${comboboxTriggerText}, ${copy.demo.combobox_aria}`" class="flex h-8 w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 ps-2.5 pe-2 text-sm whitespace-nowrap transition-colors outline-none select-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50">
										<span class="min-w-0 flex-1 truncate text-start" :class="{ 'text-muted-foreground': !selectedComboboxOption }">
											{{ comboboxTriggerText }}
										</span>
										<ChevronDownIcon class="size-4 shrink-0 text-muted-foreground" />
									</ComboboxTrigger>
								</ComboboxAnchor>
								<ComboboxList>
									<ComboboxInput :placeholder="copy.demo.combobox_placeholder" :aria-label="copy.demo.combobox_aria" :display-value="() => ''" />
									<ComboboxViewport>
										<ComboboxEmpty role="status">{{ copy.demo.combobox_empty }}</ComboboxEmpty>
										<ComboboxGroup>
											<ComboboxItem v-for="option in comboboxOptions" :key="option.value" :value="option.value" :text-value="`${option.label} ${option.value}`">
												{{ option.label }}
												<ComboboxItemIndicator>
													<CheckIcon />
												</ComboboxItemIndicator>
											</ComboboxItem>
										</ComboboxGroup>
									</ComboboxViewport>
								</ComboboxList>
							</Combobox>
						</div>

						<div v-else-if="component.id === 'checkbox'" class="flex items-center gap-2">
							<Checkbox id="demo-newsletter" v-model="newsletterOptIn" />
							<Label for="demo-newsletter">{{ copy.demo.checkbox_label }}</Label>
						</div>

						<div v-else-if="component.id === 'radio-group'" class="max-w-xs space-y-3">
							<Label class="text-sm font-medium">{{ copy.demo.radio_label }}</Label>
							<RadioGroup v-model="plan" class="gap-3">
								<div class="flex items-center gap-2">
									<RadioGroupItem id="plan-starter" value="starter" />
									<Label for="plan-starter">{{ copy.demo.radio_starter }}</Label>
								</div>
								<div class="flex items-center gap-2">
									<RadioGroupItem id="plan-pro" value="pro" />
									<Label for="plan-pro">{{ copy.demo.radio_pro }}</Label>
								</div>
								<div class="flex items-center gap-2">
									<RadioGroupItem id="plan-team" value="team" />
									<Label for="plan-team">{{ copy.demo.radio_team }}</Label>
								</div>
							</RadioGroup>
						</div>

						<div v-else-if="component.id === 'switch'" class="flex items-center gap-2">
							<Switch id="demo-notifications" v-model="notificationsEnabled" />
							<Label for="demo-notifications">{{ copy.demo.switch_label }}</Label>
						</div>

						<div v-else-if="component.id === 'form'" class="max-w-md">
							<form class="space-y-4" novalidate @submit="onSubmit">
								<FormField v-slot="{ value, handleChange, handleBlur }" name="name">
									<FormItem>
										<FormLabel>{{ copy.demo_form_name }}</FormLabel>
										<FormControl :has-description="false">
											<Input type="text" :model-value="String(value ?? '')" @update:model-value="handleChange" @blur="handleBlur" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
								<FormField v-slot="{ value, handleChange, handleBlur }" name="email">
									<FormItem>
										<FormLabel>{{ copy.demo_form_email }}</FormLabel>
										<FormControl>
											<Input type="email" :model-value="String(value ?? '')" @update:model-value="handleChange" @blur="handleBlur" />
										</FormControl>
										<FormDescription>{{ copy.demo.form_helper }}</FormDescription>
										<FormMessage />
									</FormItem>
								</FormField>
								<FormField v-slot="{ value, handleChange, handleBlur }" name="message">
									<FormItem>
										<FormLabel>{{ copy.demo_form_message }}</FormLabel>
										<FormControl :has-description="false">
											<Textarea :model-value="String(value ?? '')" @update:model-value="handleChange" @blur="handleBlur" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
								<Button type="submit">{{ copy.demo_form_submit }}</Button>
							</form>
						</div>

						<!-- Item -->
						<div v-else-if="component.id === 'item'" class="max-w-md">
							<Item variant="outline">
								<ItemMedia variant="icon">
									<SettingsIcon />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>{{ copy.demo.item_title }}</ItemTitle>
									<ItemDescription>{{ copy.demo.item_description }}</ItemDescription>
								</ItemContent>
							</Item>
						</div>

						<!-- Navigation Menu -->
						<div v-else-if="component.id === 'navigation-menu'">
							<NavigationMenu :aria-label="copy.demo.nav_menu_aria">
								<NavigationMenuList>
									<NavigationMenuItem>
										<NavigationMenuTrigger>{{ copy.demo.nav_menu_docs }}</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul class="grid w-64 gap-2 p-2">
												<li>
													<NavigationMenuLink href="#accordion">{{ copy.components.accordion?.name }}</NavigationMenuLink>
												</li>
												<li>
													<NavigationMenuLink href="#form">{{ copy.components.form?.name }}</NavigationMenuLink>
												</li>
											</ul>
										</NavigationMenuContent>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<NavigationMenuLink href="#button">{{ copy.components.button?.name }}</NavigationMenuLink>
									</NavigationMenuItem>
								</NavigationMenuList>
							</NavigationMenu>
						</div>

						<!-- Pagination -->
						<div v-else-if="component.id === 'pagination'">
							<Pagination v-slot="{ page: current }" v-model:page="page" :items-per-page="10" :total="50" :sibling-count="1" :aria-label="copy.demo.pagination_aria">
								<PaginationContent v-slot="{ items }">
									<PaginationPrevious :label="copy.previous" />
									<template v-for="(item, index) in items" :key="index">
										<PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === current">
											{{ item.value }}
										</PaginationItem>
										<PaginationEllipsis v-else :index="index" :label="copy.more_pages" />
									</template>
									<PaginationNext :label="copy.next" />
								</PaginationContent>
							</Pagination>
						</div>

						<!-- Progress / Skeleton / Spinner -->
						<div v-else-if="component.id === 'progress'" class="max-w-md space-y-2">
							<Progress :model-value="progress" />
							<p class="text-sm text-muted-foreground">{{ progress }}%</p>
						</div>

						<div v-else-if="component.id === 'skeleton'" class="max-w-md space-y-3">
							<Skeleton class="h-4 w-2/3" />
							<Skeleton class="h-4 w-full" />
							<Skeleton class="h-24 w-full" />
						</div>

						<div v-else-if="component.id === 'spinner'" class="flex items-center gap-3">
							<Spinner :label="copy.loading" />
							<span class="text-sm text-muted-foreground">{{ copy.demo.spinner_state }}</span>
						</div>

						<!-- Sheet -->
						<div v-else-if="component.id === 'sheet'">
							<Sheet>
								<SheetTrigger as-child>
									<Button variant="outline">{{ copy.demo_open_sheet }}</Button>
								</SheetTrigger>
								<SheetContent :close-label="copy.close">
									<SheetHeader>
										<SheetTitle>{{ copy.demo.sheet_title }}</SheetTitle>
										<SheetDescription>{{ copy.demo.sheet_description }}</SheetDescription>
									</SheetHeader>
									<div class="p-4 text-sm text-muted-foreground">{{ copy.demo.sheet_body }}</div>
									<SheetFooter>
										<SheetClose as-child>
											<Button variant="secondary">{{ copy.demo_cancel }}</Button>
										</SheetClose>
									</SheetFooter>
								</SheetContent>
							</Sheet>
						</div>

						<!-- Stepper -->
						<div v-else-if="component.id === 'stepper'" class="w-full max-w-xl">
							<Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="step" :linear="false" class="block w-full space-y-4">
								<div class="flex w-full items-start gap-2">
									<StepperItem v-for="item in stepperSteps" :key="item.step" v-slot="{ state }" :step="item.step" class="relative flex w-full flex-col items-center justify-center">
										<StepperSeparator v-if="item.step !== stepperSteps[stepperSteps.length - 1]?.step" class="absolute start-[calc(50%+20px)] end-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />
										<StepperTrigger as-child>
											<Button type="button" :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon" class="z-10 shrink-0 rounded-full" :class="state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background'" :aria-current="state === 'active' ? 'step' : undefined">
												<CheckIcon v-if="state === 'completed'" class="size-5" />
												<CircleIcon v-else-if="state === 'active'" class="size-5" />
												<DotIcon v-else class="size-5" />
												<span class="sr-only">{{ item.title }}</span>
											</Button>
										</StepperTrigger>
										<div class="mt-5 flex flex-col items-center text-center">
											<StepperTitle class="text-sm font-semibold" :class="state === 'active' && 'text-primary dark:text-brand-300'">
												{{ item.title }}
											</StepperTitle>
											<StepperDescription class="text-xs text-muted-foreground" :class="state === 'active' && 'text-primary dark:text-brand-300'">
												{{ item.description }}
											</StepperDescription>
										</div>
									</StepperItem>
								</div>
								<div class="flex w-full items-center justify-between gap-3">
									<Button type="button" size="sm" variant="outline" :disabled="isPrevDisabled" @click="prevStep()">{{ copy.previous }}</Button>
									<p data-stepper-status class="text-sm text-muted-foreground">{{ formatCopy(copy.demo.stepper_status, { current: step, total: stepperSteps.length }) }}</p>
									<Button type="button" size="sm" :disabled="isNextDisabled" @click="nextStep()">{{ copy.next }}</Button>
								</div>
							</Stepper>
						</div>

						<!-- Tabs -->
						<div v-else-if="component.id === 'tabs'" class="max-w-md">
							<Tabs default-value="overview">
								<TabsList>
									<TabsTrigger value="overview">{{ copy.demo.tabs_overview }}</TabsTrigger>
									<TabsTrigger value="usage">{{ copy.demo.tabs_usage }}</TabsTrigger>
								</TabsList>
								<TabsContent value="overview" class="text-sm text-muted-foreground">{{ copy.demo.tabs_overview_body }}</TabsContent>
								<TabsContent value="usage" class="text-sm text-muted-foreground">{{ copy.demo.tabs_usage_body }}</TabsContent>
							</Tabs>
						</div>

						<!-- Toast (Sonner) -->
						<div v-else-if="component.id === 'toast'">
							<Button variant="outline" @click="toast(copy.demo.toast_title, { description: copy.demo.toast_description })">
								{{ copy.demo_toast }}
							</Button>
						</div>

						<!-- Tooltip -->
						<div v-else-if="component.id === 'tooltip'">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger as-child>
										<Button variant="outline">{{ copy.demo.tooltip_trigger }}</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{{ copy.demo.tooltip_content }}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</article>
				</div>
			</section>
		</div>
	</RekaLocaleProvider>
</template>
