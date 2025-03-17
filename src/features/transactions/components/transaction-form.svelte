<script lang="ts" module>
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { insertTransactionSchema, updateTransactionSchema } from '../transactions.schemas';
	import type { getAccountOptions } from '$features/accounts/server/accounts.server';

	export type InsertTransactionForm = SuperForm<z.input<typeof insertTransactionSchema>, any>;
	export type UpdateTransactionForm = SuperForm<z.input<typeof updateTransactionSchema>, any>;
	export type TransactionForms = InsertTransactionForm | UpdateTransactionForm;
</script>

<script lang="ts">
	import { get } from 'svelte/store';

	import { Input } from '$components/ui/input';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$components/ui/form';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$components/ui/select';

	import ConfirmDialog, { getConfirmation } from '$components/confirm-dialog.svelte';

	import { LoaderCircle, Trash } from '@lucide/svelte';

	interface Props {
		form: TransactionForms;
		createAction?: string;
		updateAction?: string;
		deleteAction?: string;
		disabled?: boolean;
		accountOptions?: AsyncReturnType<typeof getAccountOptions>;
	}

	let {
		form,
		createAction = '?/create',
		updateAction = '?/update',
		deleteAction = '?/delete',
		disabled = false,
		accountOptions = []
	}: Props = $props();

	const { form: formData, enhance, submit } = form;

	let deleteForm = $state(false);

	let openConfirmDialog = $state(false);

	function isUpdateForm(form: TransactionForms): form is UpdateTransactionForm {
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

<form action="#####" method="post" class="space-y-4 pt-2" use:enhance>
	{#if $formData.id}
		<FormField {form} name="id">
			<FormControl>
				{#snippet children({ props })}
					<Input {...props} value={$formData.id} hidden {disabled} />
				{/snippet}
			</FormControl>
		</FormField>
	{/if}

	<FormField {form} name="accountId">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Account</FormLabel>

				<Select
					type="single"
					value={`${$formData.accountId}`}
					onValueChange={(value) => ($formData.accountId = Number(value))}
					name={props.name}
				>
					<SelectTrigger>Select an account</SelectTrigger>
					<SelectContent>
						{#each accountOptions as option}
							<SelectItem value={`${option.id}`} label={option.name} />
						{/each}
					</SelectContent>
				</Select>

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
			{isUpdateForm(form) ? 'Save Changes' : 'Create transaction'}
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
				<Trash size={16} class="mr-1" />Delete transaction
			{/if}
		</FormButton>

		<ConfirmDialog
			bind:open={openConfirmDialog}
			title="Are you sure?"
			description="You are about to delete this transaction"
		/>
	{/if}
</form>
