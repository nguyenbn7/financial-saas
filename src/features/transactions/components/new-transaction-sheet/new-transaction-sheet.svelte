<script lang="ts" module>
	let open = $state(false);

	export function openNewTransactionSheet() {
		open = true;
	}

	export function closeNewTransactionSheet() {
		open = false;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	import { createCreateAccountClient, createGetAccountsClient } from '$features/accounts/api';

	import { createCreateCategoryClient, createGetCategoriesClient } from '$features/categories/api';

	import { transactionFormSchema } from '$features/transactions/schema';
	import { createCreateTransactionClient } from '$features/transactions/api';
	import { TransactionForm } from '$features/transactions/components';

	const queryClient = useQueryClient();

	const getAccountsClient = createGetAccountsClient();

	let accounts = $derived(open ? $getAccountsClient.data.accounts : []);

	const createAccountClient = createCreateAccountClient({
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get', 'accounts'] });
		}
	});

	const getCategoriesClient = createGetCategoriesClient();

	let categories = $derived(open ? $getCategoriesClient.data.categories : []);

	const createCategoryClient = createCreateCategoryClient({
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get', 'categories'] });
		}
	});

	const createTransactionClient = createCreateTransactionClient({
		onSuccess() {
			open = false;

			toast.success('Transaction created');

			queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });
		},
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				open = false;
				return goto('/sign-in', { invalidateAll: true });
			}
		}
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
		}
	});

	let disabled = $derived(
		$createTransactionClient.isPending ||
			$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);
</script>

<Sheet
	bind:open
	onOpenChange={(value) => {
		if (!value) {
			form.reset();
		}
	}}
>
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
