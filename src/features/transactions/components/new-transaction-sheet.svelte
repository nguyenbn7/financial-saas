<script lang="ts">
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

	import { createCreateAccountClient, createGetAccountsClient } from '$features/accounts/api';

	import { createCreateCategoryClient, createGetCategoriesClient } from '$features/categories/api';

	import { useNewTransaction } from '$features/transactions/hooks/use-new-transaction';
	import { transactionFormSchema } from '$features/transactions/schema';
	import { createCreateTransactionClient } from '$features/transactions/api';
	import { TransactionForm } from '$features/transactions/components';

	const { isOpen, onClose } = useNewTransaction();

	const queryClient = useQueryClient();

	const getAccountsClient = createGetAccountsClient();
	const createAccountClient = createCreateAccountClient();

	let accounts = $derived($isOpen ? $getAccountsClient.data.accounts : []);

	const getCategoriesClient = createGetCategoriesClient();
	const createCategoryClient = createCreateCategoryClient();

	let categories = $derived($isOpen ? $getCategoriesClient.data.categories : []);

	const createTransactionClient = createCreateTransactionClient({
		onSuccess: () => onClose()
	});

	const form = superForm(defaults(zod(transactionFormSchema)), {
		id: 'create transaction form',
		SPA: true,
		dataType: 'json',
		validators: zodClient(transactionFormSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid) {
				$createTransactionClient.mutate(validatedForm.data);
			}
		},
		resetForm: false
	});

	let disabled = $derived(
		$createTransactionClient.isPending ||
			$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);

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
