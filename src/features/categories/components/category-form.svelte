<script lang="ts">
	import type { CategoryFormValues } from '.';

	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		form: CategoryFormValues;
		createAction: string;
		updateAction: string;
		disabled?: boolean;
		showLoader?: boolean;
	}

	let { form, createAction, updateAction, disabled = false, showLoader = false }: Props = $props();

	const { form: formData, enhance } = form;
</script>

<form method="post" class="space-y-4 mt-2" use:enhance>
	{#if $formData.id}
		<FormField {form} name="id">
			<FormControl>
				{#snippet children({ props })}
					<Input {...props} value={$formData.id} hidden />
				{/snippet}
			</FormControl>
		</FormField>
	{/if}

	<FormField {form} name="name">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Name</FormLabel>

				<Input
					{...props}
					bind:value={$formData.name}
					placeholder="e.g. Food, Travel, etc."
					class="mt-2"
					{disabled}
				/>

				<FormFieldErrors />
			{/snippet}
		</FormControl>
	</FormField>

	<FormButton class="w-full" {disabled} formaction={$formData.id ? updateAction : createAction}>
		{#if disabled && showLoader}
			<LoaderCircle size={16} class="mr-1 text-primary-foreground animate-spin" />
			{$formData.id ? 'Saving...' : 'Creating...'}
		{:else}
			{$formData.id ? 'Save Changes' : 'Create category'}
		{/if}
	</FormButton>
</form>
