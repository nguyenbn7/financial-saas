<script lang="ts">
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { transactionFormSchema } from '$features/transactions/schema';

	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { FormControl, FormField, FormFieldErrors, FormLabel } from '$lib/components/ui/form';

	import { Form } from '$lib/components/form';
	import { DatePicker } from '$lib/components/date-picker';
	import { AmountInput } from '$lib/components/amount-input';
	import { CreatableSelect } from '$lib/components/select';

	interface Props {
		id?: string;
		form: SuperForm<z.infer<typeof transactionFormSchema>, any>;
		disabled?: boolean;
		disableLoader?: boolean;
		onCreateAccount: (name: string) => void;
		accountOptions: { label: string; value: string }[];
		onCreateCategory: (name: string) => void;
		categoryOptions: { label: string; value: string }[];
	}

	let {
		id,
		form,
		disabled = false,
		disableLoader = false,
		onCreateAccount,
		accountOptions,
		onCreateCategory,
		categoryOptions
	}: Props = $props();

	const { form: formData } = form;
	const createForm = $derived(!Boolean(id));
</script>

<Form
	{form}
	class="space-y-4 mt-2"
	createButtonText="Create transaction"
	{disabled}
	{createForm}
	{disableLoader}
>
	{#snippet content({ disabled })}
		<FormField {form} name="date">
			<FormControl>
				{#snippet children({ props })}
					<DatePicker bind:value={$formData.date} {disabled} />

					<input {...props} hidden value={$formData.date} />
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
						value={$formData.accountId}
						{disabled}
						options={accountOptions}
						onCreate={onCreateAccount}
						onValueChange={(value) => ($formData.accountId = value)}
					/>

					<input {...props} hidden value={$formData.accountId} />
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
						value={$formData.categoryId ?? undefined}
						{disabled}
						options={categoryOptions}
						onCreate={onCreateCategory}
						onValueChange={(value) => ($formData.categoryId = value)}
					/>

					<input {...props} hidden value={$formData.categoryId} />
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

					<AmountInput bind:value={$formData.amount} {disabled} />
					<input {...props} hidden value={$formData.amount} />
				{/snippet}
			</FormControl>

			<FormFieldErrors />
		</FormField>

		<FormField {form} name="notes">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Notes</FormLabel>

					<Textarea
						{...props}
						bind:value={$formData.notes}
						{disabled}
						placeholder="Optional notes"
					/>
				{/snippet}
			</FormControl>

			<FormFieldErrors />
		</FormField>
	{/snippet}
</Form>
