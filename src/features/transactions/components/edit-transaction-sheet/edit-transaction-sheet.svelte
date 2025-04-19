<script lang="ts" module>
	let open = $state(false);
	let id: string | undefined = $state();

	export function openEditTransactionSheet(transactionId: string) {
		id = transactionId;
		open = true;
	}

	export function closeEditTransactionSheet() {
		open = false;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';

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

	let getTransactionClient = $derived(id ? createGetTransactionClient({ id }) : undefined);
	let transaction = $derived($getTransactionClient?.data?.transaction ?? undefined);

	const updateTransactionClient = createUpdateTransactionClient({
		onSuccess() {
			open = false;
			toast.success('Transaction updated');

			if (id) {
				queryClient.invalidateQueries({ queryKey: ['get', 'transaction', id] });
				id = undefined;
			}
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

	const deleteTransactionsClient = createDeleteTransactionsClient({
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				return goto('/sign-in', { invalidateAll: true });
			}
		},
		onSuccess() {
			open = false;
			toast.success('Transaction deleted');

			if (id) {
				queryClient.invalidateQueries({ queryKey: ['get', 'transaction', id] });
				id = undefined;
			}
			queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });
		}
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
		}
	});

	const { form: formData } = form;

	$effect(() => {
		if (transaction) formData.set({ ...transaction });
	});

	let disabled = $derived(
		$deleteTransactionsClient.isPending ||
			$updateTransactionClient.isPending ||
			$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);
</script>

<Sheet
	bind:open
	onOpenChange={(value) => {
		if (id) {
			queryClient.invalidateQueries({ queryKey: ['get', 'transaction', id] });
			id = undefined;
		}

		form.reset(defaults(zod(transactionFormSchema)));
	}}
>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$updateTransactionClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>Edit Transaction</SheetTitle>
			<SheetDescription>Edit an existing transaction.</SheetDescription>
		</SheetHeader>

		<TransactionForm
			{id}
			{form}
			{disabled}
			disableLoader={$deleteTransactionsClient.isPending}
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

				if (ok && id) {
					$deleteTransactionsClient.mutate({ ids: [id] });
				}
			}}
		>
			{#if disabled && $deleteTransactionsClient.isPending}
				<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
				Deleting...
			{:else}
				<Trash size={16} class="mr-1" />Delete account
			{/if}
		</Button>
	</SheetContent>
</Sheet>
