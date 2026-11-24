<script setup lang="ts">
import type { ComboboxInputEmits, ComboboxInputProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { SearchIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxInput, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps<ComboboxInputProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<ComboboxInputEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<InputGroup class="h-8">
		<InputGroupAddon>
			<SearchIcon />
		</InputGroupAddon>
		<ComboboxInput data-slot="combobox-input" v-bind="{ ...$attrs, ...forwarded }" :class="cn('h-8 flex-1 bg-transparent px-0 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50', props.class)" />
	</InputGroup>
</template>
