<script lang="ts">
	import { useNewTransaction } from '$features/transactions/components/new-transaction-sheet';
	import { transactionSchema } from '$features/transactions/schema';
	import { useCreateTransaction } from '$features/transactions/api';
	import { TransactionForm } from '$features/transactions/components/form';

	import { useCreateAccount, useGetAccounts } from '$features/accounts/api';

	import { useCreateCategory, useGetCategories } from '$features/categories/api';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	const { isOpen, onClose } = useNewTransaction();

	const queryClient = useQueryClient();

	const getAccountsClient = useGetAccounts();
	const createAccountClient = useCreateAccount();

	let accounts = $derived($isOpen ? $getAccountsClient.data.accounts : []);

	const getCategoriesClient = useGetCategories();
	const createCategoryClient = useCreateCategory();

	let categories = $derived($isOpen ? $getCategoriesClient.data.categories : []);

	const createTransactionClient = useCreateTransaction({
		onSuccess: () => onClose()
	});

	const form = superForm(defaults(zod(transactionSchema)), {
		id: 'create transaction form',
		SPA: true,
		dataType: 'json',
		validators: zodClient(transactionSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid) {
				$createTransactionClient.mutate(validatedForm.data);
			}
		},
		resetForm: false
	});

	let disableLoader = $derived(
		$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);

	let disabled = $derived($createTransactionClient.isPending || disableLoader);

	$effect(() => {
		if (!$isOpen) form.reset();
	});
</script>

<Sheet open={$isOpen} onOpenChange={onClose}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$createTransactionClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>New Transaction</SheetTitle>
			<SheetDescription>Create a new transaction.</SheetDescription>
		</SheetHeader>

		<TransactionForm
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
	</SheetContent>
</Sheet>
