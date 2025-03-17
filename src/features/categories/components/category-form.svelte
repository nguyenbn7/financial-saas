<script lang="ts" module>
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { insertCategorySchema, updateCategorySchema } from '../schemas';

	export type InsertCategoryForm = SuperForm<z.input<typeof insertCategorySchema>, any>;
	export type UpdateCategoryForm = SuperForm<z.input<typeof updateCategorySchema>, any>;
	export type CategoryForms = InsertCategoryForm | UpdateCategoryForm;
</script>

<script lang="ts">
	import { get } from 'svelte/store';

	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$components/ui/form';
	import { Input } from '$components/ui/input';

	import ConfirmDialog, { getConfirmation } from '$components/confirm-dialog.svelte';

	import { LoaderCircle, Trash } from '@lucide/svelte';

	interface Props {
		form: CategoryForms;
		createAction?: string;
		updateAction?: string;
		deleteAction?: string;
		disabled?: boolean;
	}

	let {
		form,
		createAction = '?/create',
		updateAction = '?/update',
		deleteAction = '?/delete',
		disabled = false
	}: Props = $props();

	const { form: formData, enhance, submit } = form;

	let deleteForm = $state(false);

	let openConfirmDialog = $state(false);

	function isUpdateForm(form: CategoryForms): form is UpdateCategoryForm {
		return get(form.form).id !== undefined;
	}

	async function onDelete(
		event:
			| (MouseEvent & { currentTarget: EventTarget & HTMLButtonElement })
			| (MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement })
	) {
		openConfirmDialog = true;
		event.preventDefault();

		const ok = await getConfirmation();

		if (ok) {
			deleteForm = true;
			return submit(event.target);
		}
	}
</script>

<form method="post" class="space-y-4 mt-2" use:enhance>
	{#if isUpdateForm(form)}
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

	<FormButton
		class="w-full"
		{disabled}
		formaction={isUpdateForm(form) ? updateAction : createAction}
	>
		{#if disabled && !deleteForm}
			<LoaderCircle size={16} class="mr-1 text-primary-foreground animate-spin" />
			{isUpdateForm(form) ? 'Saving...' : 'Creating...'}
		{:else}
			{isUpdateForm(form) ? 'Save Changes' : 'Create category'}
		{/if}
	</FormButton>

	{#if isUpdateForm(form)}
		<FormButton
			formaction={deleteAction}
			class="w-full"
			{disabled}
			variant="outline-red"
			onclick={onDelete}
		>
			{#if disabled && deleteForm}
				<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
				Deleting...
			{:else}
				<Trash size={16} class="mr-1" />Delete category
			{/if}
		</FormButton>

		<ConfirmDialog
			bind:open={openConfirmDialog}
			title="Are you sure?"
			description="You are about to delete this category"
		/>
	{/if}
</form>
