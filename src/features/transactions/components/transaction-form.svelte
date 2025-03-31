<script lang="ts">
	import type { TransactionFormValues } from '.';

	import { Input } from '$lib/components/ui/input';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';

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
	}

	let {
		form,
		createAction,
		updateAction,
		accountOptions,
		onCreateAccount,
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
					<Input {...props} value={$formData.id} hidden {disabled} />
				{/snippet}
			</FormControl>
		</FormField>
	{/if}

	<FormField {form} name="id">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Account</FormLabel>
				
				<CreatableSelect
					{...props}
					placeholder="Select an account"
					value={`${$formData.accountId}`}
					{disabled}
					options={accountOptions}
					onCreate={onCreateAccount}
					onValueChange={(value) => ($formData.accountId = Number(value))}
				/>
			{/snippet}
		</FormControl>

		<FormFieldErrors />
	</FormField>

	<!-- <CreatableSelect placeholder="Select an account" /> -->
	<!-- <FormField {form} name="accountId">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Account</FormLabel>
				<Select
					type="single"
					value={`${$formData.accountId}`}
					onValueChange={(value) => ($formData.accountId = Number(value))}
					name={props.name}
				>
					<SelectTrigger class="mt-2"
						>{accountOptions.find((a) => a.id === $formData.accountId)?.name ??
							'Select an account'}</SelectTrigger
					>
					<SelectContent>
						{#each accountOptions as option}
							<SelectItem value={`${option.id}`} label={option.name} />
						{/each}
					</SelectContent>
				</Select>
			{/snippet}
			<FormFieldErrors />
		</FormControl>
	</FormField> -->

	<FormButton class="w-full" {disabled} formaction={$formData.id ? updateAction : createAction}>
		{#if disabled && showLoader}
			<LoaderCircle size={16} class="mr-1 text-primary-foreground animate-spin" />
			{$formData.id ? 'Saving...' : 'Creating...'}
		{:else}
			{$formData.id ? 'Save Changes' : 'Create transaction'}
		{/if}
	</FormButton>
</form>
