<script lang="ts">
	import type { TransactionFormValues } from '.';
	import type { AccountOptions } from '$features/accounts/api';

	import { Input } from '$lib/components/ui/input';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		form: TransactionFormValues;
		createAction: string;
		updateAction: string;
		disabled?: boolean;
		showLoader?: boolean;
		accountOptions: AccountOptions;
	}

	let {
		form,
		createAction,
		updateAction,
		accountOptions,
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

				<FormFieldErrors />
			{/snippet}
		</FormControl>
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
