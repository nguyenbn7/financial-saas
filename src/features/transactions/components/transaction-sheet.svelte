<script lang="ts">
	import type { TransactionFormValues } from '.';
	import type { AccountOptions } from '$features/accounts/api';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	import { ConfirmDialog, getConfirmation } from '$lib/components/confirm-dialog';

	import { TransactionForm } from '.';

	import { LoaderCircle, Trash } from '@lucide/svelte';

	interface Props {
		form: TransactionFormValues;
		accountOptions: AccountOptions;
		open?: boolean;
		createAction?: string;
		updateAction?: string;
		onOpenChange?: (value: boolean) => void;
		onDelete?: (id: number) => MaybePromise<void>;
		disabled?: boolean;
		deleting?: boolean;
	}

	let {
		form,
		accountOptions,
		onOpenChange,
		onDelete,
		open = $bindable(false),
		createAction = '?/create',
		updateAction = '?/update',
		disabled = false,
		deleting = false
	}: Props = $props();

	const { form: formData } = form;

	let openConfirmDialog = $state(false);

	async function onClick() {
		openConfirmDialog = true;

		const ok = await getConfirmation();

		if (ok) {
			return await onDelete?.($formData.id!);
		}
	}
</script>

<Sheet bind:open {onOpenChange}>
	<SheetContent class="space-y-4" interactOutsideBehavior={disabled ? 'ignore' : 'close'}>
		<SheetHeader>
			<SheetTitle>New Transaction</SheetTitle>
			<SheetDescription>Create a new account to track your transactions.</SheetDescription>
		</SheetHeader>

		<TransactionForm
			{form}
			{disabled}
			{createAction}
			{updateAction}
			showLoader={!deleting}
			{accountOptions}
		/>

		{#if $formData.id}
			<Button class="w-full" {disabled} variant="outline-red" onclick={onClick}>
				{#if disabled && deleting}
					<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
					Deleting...
				{:else}
					<Trash size={16} class="mr-1" />Delete transaction
				{/if}
			</Button>
		{/if}
	</SheetContent>
</Sheet>

<ConfirmDialog
	bind:open={openConfirmDialog}
	title="Are you sure?"
	description="You are about to delete this account"
/>
