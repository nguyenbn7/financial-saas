<script lang="ts">
	import type { AccountFormValues } from '.';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	import { ConfirmDialog, getConfirmation } from '$lib/components/confirm-dialog';

	import { AccountForm } from '.';

	import { LoaderCircle, Trash } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		form: AccountFormValues;
		createAction?: string;
		updateAction?: string;
		onOpenChange?: (value: boolean) => void;
		onDelete?: (id: number) => MaybePromise<void>;
		disabled?: boolean;
		deleting?: boolean;
	}

	let {
		form,
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
			<SheetTitle>{$formData.id ? 'Edit ' : 'New '}Account</SheetTitle>
			<SheetDescription>
				{$formData.id
					? 'Edit an existing account.'
					: 'Create a new account to track your transactions.'}
			</SheetDescription>
		</SheetHeader>

		<AccountForm {form} {disabled} {createAction} {updateAction} showLoader={!deleting} />

		{#if $formData.id}
			<Button class="w-full" {disabled} variant="outline-red" onclick={onClick}>
				{#if disabled && deleting}
					<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
					Deleting...
				{:else}
					<Trash size={16} class="mr-1" />Delete account
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
