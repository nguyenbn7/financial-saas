<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import { useEditAccount } from '$features/accounts/components/edit-account-sheet';
	import { accountSchema } from '$features/accounts/schema';
	import { AccountForm } from '$features/accounts/components';
	import { useUpdateAccount, useGetAccount, useDeleteAccounts } from '$features/accounts/api';

	import { useConfirm } from '$lib/components/confirm-dialog';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	const { confirm } = useConfirm();

	const queryClient = useQueryClient();

	const { isOpen, accountId, onClose } = useEditAccount();

	const getAccountClient = useGetAccount();

	const updateAccountClient = useUpdateAccount({
		async onSuccess(data, variables, context) {
			onClose();

			const { param } = variables;

			await queryClient.invalidateQueries({ queryKey: ['get', 'account', param.id] });
		}
	});

	const deleteAccountsClient = useDeleteAccounts({
		onSuccess: () => onClose()
	});

	const account = $derived($getAccountClient.data?.account);

	const form = superForm(defaults(zod(accountSchema)), {
		id: 'edit account form',
		SPA: true,
		validators: zodClient(accountSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid && account) {
				$updateAccountClient.mutate({ param: { id: account.id }, json: validatedForm.data });
			}
		},
		resetForm: false
	});

	const { form: formData } = form;

	$effect(() => {
		if (account) formData.set({ ...account });
		else form.reset(defaults(zod(accountSchema)));
	});

	const disableLoader = $derived($deleteAccountsClient.isPending || $getAccountClient.isFetching);

	const disabled = $derived($updateAccountClient.isPending || disableLoader);
</script>

<Sheet open={$isOpen} onOpenChange={onClose}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$updateAccountClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>Edit Account</SheetTitle>
			<SheetDescription>Edit an existing account.</SheetDescription>
		</SheetHeader>

		<AccountForm id={$accountId} {form} {disabled} {disableLoader} />

		<Button
			class="w-full"
			{disabled}
			variant="outline-red"
			onclick={async () => {
				const ok = await confirm({
					title: 'Are you sure?',
					description: 'You are about to delete this account'
				});

				if (ok && $accountId) {
					$deleteAccountsClient.mutate({ ids: [$accountId] });
				}
			}}
		>
			{#if disabled && $deleteAccountsClient.isPending}
				<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
				Deleting...
			{:else}
				<Trash size={16} class="mr-1" />Delete account
			{/if}
		</Button>
	</SheetContent>
</Sheet>
