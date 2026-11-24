<script lang="ts" setup>
import { Slot } from 'reka-ui';
import { useFormField } from './useFormField';

withDefaults(defineProps<{ hasDescription?: boolean }>(), { hasDescription: true });

const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
</script>

<template>
	<Slot :id="formItemId" data-slot="form-control" :aria-describedby="[hasDescription && formDescriptionId, error && formMessageId].filter(Boolean).join(' ') || undefined" :aria-invalid="!!error">
		<slot />
	</Slot>
</template>
