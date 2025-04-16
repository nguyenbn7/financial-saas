<script lang="ts">
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { accountFormSchema } from '$features/accounts/schema';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	import { confirm } from '$lib/components/confirm-dialog';

	import { AccountForm } from '.';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Trash from '@lucide/svelte/icons/trash';

	interface Props {
		open?: boolean;
		form: SuperForm<z.infer<typeof accountFormSchema>, any>;
		onOpenChange?: (value: boolean) => void;
		onDelete?: (id: string) => MaybePromise<void>;
		disabled?: boolean;
		deleting?: boolean;
	}

	let {
		form,
		onOpenChange,
		onDelete,
		open = $bindable(false),
		disabled = false,
		deleting = false
	}: Props = $props();

	const { form: formData } = form;
</script>

<Sheet bind:open {onOpenChange}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={disabled ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>{$formData.id ? 'Edit Account' : 'New Account'}</SheetTitle>
			<SheetDescription>
				{$formData.id
					? 'Edit an existing account.'
					: 'Create a new account to track your transactions.'}
			</SheetDescription>
		</SheetHeader>

		<AccountForm {form} {disabled} disableLoader={deleting} />

		{#if $formData.id}
			<Button
				class="w-full"
				{disabled}
				variant="outline-red"
				onclick={async () => {
					const ok = await confirm({
						title: 'Are you sure?',
						description: 'You are about to delete this account'
					});

					if (ok && $formData.id) {
						return await onDelete?.($formData.id);
					}
				}}
			>
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
