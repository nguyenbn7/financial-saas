<script lang="ts">
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

	import { confirm } from '$lib/components/confirm-dialog';

	import { useEditAccount } from '$features/accounts/hooks/use-edit-account';
	import { accountFormSchema } from '$features/accounts/schema';
	import { AccountForm } from '$features/accounts/components';
	import {
		createUpdateAccountClient,
		createGetAccountClient,
		createDeleteAccountsClient
	} from '$features/accounts/api';

	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const queryClient = useQueryClient();

	const { isOpen, accountId, onClose } = useEditAccount();

	let getAccountClient = $derived(
		$accountId ? createGetAccountClient({ id: $accountId }) : undefined
	);
	let account = $derived($getAccountClient?.data?.account);

	const updateAccountClient = createUpdateAccountClient({
		async onSuccess(data, variables, context) {
			onClose();

			const { param } = variables;

			await queryClient.invalidateQueries({ queryKey: ['get', 'account', param.id] });
		}
	});

	const deleteAccountsClient = createDeleteAccountsClient({
		onSuccess: () => onClose()
	});

	const form = superForm(defaults(zod(accountFormSchema)), {
		id: 'edit account form',
		SPA: true,
		validators: zodClient(accountFormSchema),
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
		else form.reset(defaults(zod(accountFormSchema)));
	});

	let disableLoader = $derived($deleteAccountsClient.isPending || $getAccountClient?.isFetching);

	let disabled = $derived($updateAccountClient.isPending || disableLoader);
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
