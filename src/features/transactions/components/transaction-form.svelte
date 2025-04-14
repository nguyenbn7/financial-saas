<script lang="ts">
	import type { TransactionFormValues } from '.';

	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';

	import { DatePicker } from '$lib/components/date-picker';
	import { AmountInput } from '$lib/components/amount-input';
	import { CreatableSelect } from '$lib/components/select';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		form: TransactionFormValues;
		createAction: string;
		updateAction: string;
		disabled?: boolean;
		showLoader?: boolean;
		onCreateAccount: (name: string) => void;
		accountOptions: { label: string; value: string }[];
		onCreateCategory: (name: string) => void;
		categoryOptions: { label: string; value: string }[];
	}

	let {
		form,
		createAction,
		updateAction,
		onCreateAccount,
		accountOptions,
		onCreateCategory,
		categoryOptions,
		disabled = false,
		showLoader = false
	}: Props = $props();

	const { form: formData, enhance } = form;
</script>

<form method="post" class="space-y-4 pt-2" use:enhance>
	{#if $formData.id}
		<FormField {form} name="id">
			<FormControl>
				{#snippet children({ props })}
					<input {...props} value={$formData.id} hidden {disabled} />
				{/snippet}
			</FormControl>
		</FormField>
	{/if}

	<FormField {form} name="date">
		<FormControl>
			{#snippet children({ props })}
				<DatePicker bind:value={$formData.date} {disabled} />

				<input {...props} hidden value={$formData.date} {disabled} />
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<FormField {form} name="accountId">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Account</FormLabel>

				<CreatableSelect
					{...props}
					placeholder="Select an account"
					value={$formData.accountId.toString()}
					{disabled}
					options={accountOptions}
					onCreate={onCreateAccount}
					onValueChange={(value) => ($formData.accountId = Number(value))}
				/>

				<input {...props} hidden value={$formData.accountId} {disabled} />
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<FormField {form} name="categoryId">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Category</FormLabel>

				<CreatableSelect
					placeholder="Select a category"
					value={$formData.categoryId?.toString()}
					{disabled}
					options={categoryOptions}
					onCreate={onCreateCategory}
					onValueChange={(value) => ($formData.categoryId = Number(value))}
				/>

				<input {...props} hidden value={$formData.categoryId} {disabled} />
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<FormField {form} name="payee">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Payee</FormLabel>

				<Input {...props} bind:value={$formData.payee} {disabled} placeholder="Add a payee" />
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<FormField {form} name="amount">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Amount</FormLabel>

				<AmountInput
					{...props}
					bind:value={$formData.amount}
					{disabled}
					placeholder="Optional notes"
				/>
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<FormField {form} name="notes">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Notes</FormLabel>

				<Textarea {...props} bind:value={$formData.notes} {disabled} placeholder="Optional notes" />
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<FormButton class="w-full" {disabled} formaction={$formData.id ? updateAction : createAction}>
		{#if disabled && showLoader}
			<LoaderCircle size={16} class="mr-1 text-primary-foreground animate-spin" />
			{$formData.id ? 'Saving...' : 'Creating...'}
		{:else}
			{$formData.id ? 'Save Changes' : 'Create transaction'}
		{/if}
	</FormButton>
</form>
