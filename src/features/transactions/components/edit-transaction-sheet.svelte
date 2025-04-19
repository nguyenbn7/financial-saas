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

	import { createCreateAccountClient, createGetAccountsClient } from '$features/accounts/api';

	import { createCreateCategoryClient, createGetCategoriesClient } from '$features/categories/api';

	import { useEditTransaction } from '$features/transactions/hooks/use-edit-transaction';
	import { transactionFormSchema } from '$features/transactions/schema';
	import { TransactionForm } from '$features/transactions/components';
	import {
		createUpdateTransactionClient,
		createGetTransactionClient,
		createDeleteTransactionsClient
	} from '$features/transactions/api';

	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const queryClient = useQueryClient();

	const { isOpen, transactionId, onClose } = useEditTransaction();

	const getAccountsClient = createGetAccountsClient();
	const createAccountClient = createCreateAccountClient();

	let accounts = $derived($isOpen ? $getAccountsClient.data.accounts : []);

	const getCategoriesClient = createGetCategoriesClient();
	const createCategoryClient = createCreateCategoryClient();

	let categories = $derived($isOpen ? $getCategoriesClient.data.categories : []);

	let getTransactionClient = $derived(
		$transactionId ? createGetTransactionClient({ id: $transactionId }) : undefined
	);
	let transaction = $derived($getTransactionClient?.data?.transaction ?? undefined);

	const updateTransactionClient = createUpdateTransactionClient({
		async onSuccess(data, variables, context) {
			onClose();

			const { param } = variables;

			await queryClient.invalidateQueries({ queryKey: ['get', 'transaction', param.id] });
		}
	});

	const deleteTransactionsClient = createDeleteTransactionsClient({
		onSuccess: () => onClose()
	});

	const form = superForm(defaults(zod(transactionFormSchema)), {
		id: 'edit transaction form',
		SPA: true,
		validators: zodClient(transactionFormSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid && transaction) {
				$updateTransactionClient.mutate({
					param: { id: transaction.id },
					json: validatedForm.data
				});
			}
		},
		resetForm: false
	});

	const { form: formData } = form;

	$effect(() => {
		if (transaction) formData.set({ ...transaction });
		else form.reset(defaults(zod(transactionFormSchema)));
	});

	let disableLoader = $derived(
		$getTransactionClient?.isFetching ||
			$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);

	let disabled = $derived(
		$updateTransactionClient.isPending || $deleteTransactionsClient.isPending || disableLoader
	);
</script>

<Sheet open={$isOpen} onOpenChange={onClose}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$updateTransactionClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>Edit Transaction</SheetTitle>
			<SheetDescription>Edit an existing transaction.</SheetDescription>
		</SheetHeader>

		<TransactionForm
			id={$transactionId}
			{form}
			{disabled}
			{disableLoader}
			accountOptions={accounts.map((account) => ({
				label: account.name,
				value: account.id.toString()
			}))}
			onCreateAccount={(name) => $createAccountClient.mutate({ name })}
			categoryOptions={categories.map((category) => ({
				label: category.name,
				value: category.id.toString()
			}))}
			onCreateCategory={(name) => $createCategoryClient.mutate({ name })}
		/>

		<Button
			class="w-full"
			{disabled}
			variant="outline-red"
			onclick={async () => {
				const ok = await confirm({
					title: 'Are you sure?',
					description: 'You are about to delete this transaction'
				});

				if (ok && $transactionId) {
					$deleteTransactionsClient.mutate({ ids: [$transactionId] });
				}
			}}
		>
			{#if disabled && $deleteTransactionsClient.isPending}
				<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
				Deleting...
			{:else}
				<Trash size={16} class="mr-1" />Delete transaction
			{/if}
		</Button>
	</SheetContent>
</Sheet>
