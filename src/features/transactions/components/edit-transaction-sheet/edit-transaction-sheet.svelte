<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import { useEditTransaction } from '$features/transactions/components/edit-transaction-sheet';
	import { transactionSchema } from '$features/transactions/schema';
	import { TransactionForm } from '$features/transactions/components/form';
	import {
		useUpdateTransaction,
		useGetTransaction,
		useDeleteTransactions
	} from '$features/transactions/api';

	import { useCreateAccount, useGetAccounts } from '$features/accounts/api';

	import { useCreateCategory, useGetCategories } from '$features/categories/api';

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

	const { isOpen, transactionId, onClose } = useEditTransaction();

	const getAccountsClient = useGetAccounts();
	const createAccountClient = useCreateAccount();

	const accounts = $derived($isOpen ? $getAccountsClient.data.accounts : []);

	const getCategoriesClient = useGetCategories();
	const createCategoryClient = useCreateCategory();

	const categories = $derived($isOpen ? $getCategoriesClient.data.categories : []);

	const getTransactionClient = useGetTransaction();

	const updateTransactionClient = useUpdateTransaction({
		async onSuccess(data, variables, context) {
			onClose();

			const { param } = variables;

			await queryClient.invalidateQueries({ queryKey: ['get', 'transaction', param.id] });
		}
	});

	const deleteTransactionsClient = useDeleteTransactions({
		onSuccess: () => onClose()
	});

	const transaction = $derived($getTransactionClient.data?.transaction);

	const form = superForm(defaults(zod(transactionSchema)), {
		id: 'edit transaction form',
		SPA: true,
		validators: zodClient(transactionSchema),
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
		else form.reset(defaults(zod(transactionSchema)));
	});

	const disableLoader = $derived(
		$getTransactionClient.isFetching ||
			$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);

	const disabled = $derived(
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
