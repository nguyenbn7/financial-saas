<script lang="ts">
	import type { PageData } from './$types';

	import { applyAction } from '$app/forms';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { confirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { Sheet } from '$lib/components/sheet';
	import { DataTable, DataTableDeletesButton, DataTableLoader } from '$lib/components/datatable';

	import { createCreateAccountClient, createGetAccountsClient } from '$features/accounts/api';

	import { createCreateCategoryClient, createGetCategoriesClient } from '$features/categories/api';

	import { getColumns } from '$features/transactions/columns';
	import { TransactionForm } from '$features/transactions/components';
	import { transactionFormSchema } from '$features/transactions/schema';
	import {
		createDeleteTransactionsClient,
		createGetTransactionsClient
	} from '$features/transactions/api';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	const getTransactionsClient = createGetTransactionsClient({
		initialData: { transactions: data.transactions },
		enabled: false
	});

	const getAccountsClient = createGetAccountsClient({
		initialData: { accounts: data.accounts },
		enabled: false
	});

	const createAccountClient = createCreateAccountClient({
		onSuccess() {
			$getAccountsClient.refetch();
		}
	});

	const getCategoriesClient = createGetCategoriesClient({
		initialData: { categories: data.categories },
		enabled: false
	});

	const createCategoryClient = createCreateCategoryClient({
		onSuccess() {
			$getCategoriesClient.refetch();
		}
	});

	let openSheet = $state(false);
	let transactions = $derived($getTransactionsClient.data.transactions);
	let accounts = $derived($getAccountsClient.data.accounts);
	let categories = $derived($getCategoriesClient.data.categories);

	const columns = getColumns({
		onEdit(transaction) {
			openSheet = true;

			form.form.set({ ...transaction });
		}
	});

	const deleteTransactionsClient = createDeleteTransactionsClient({
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				return applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			}
		},
		onSuccess(data, variables, context) {
			if (variables.ids.length === 1) {
				openSheet = false;
				toast.success('Transaction deleted');
			} else {
				toast.success('Transactions deleted');
			}

			$getTransactionsClient.refetch();
		}
	});

	const form = superForm(data.form, {
		validators: zodClient(transactionFormSchema),
		async onUpdate({ form: validatedForm, result }) {
			if (result.status === 401) {
				if (validatedForm.message) {
					toast.error(validatedForm.message);
				}

				return applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			}
		},
		onError({ result }) {
			loading = false;
			openSheet = false;
			form.reset();

			if (result.error.message) toast.error(result.error.message);
		},
		onUpdated({ form: validatedForm }) {
			if (!validatedForm.valid) {
				if (validatedForm.message) toast.error(validatedForm.message);
				return;
			}

			loading = false;
			openSheet = false;
			form.reset();

			if (validatedForm.message) toast.success(validatedForm.message);

			$getTransactionsClient.refetch();
		}
	});

	const { delayed, form: formData } = form;

	let loading = $derived(
		$deleteTransactionsClient.isPending || $delayed || $getTransactionsClient.isPending
	);

	let disabledForm = $derived(
		loading ||
			$getAccountsClient.isFetching ||
			$createAccountClient.isPending ||
			$getCategoriesClient.isFetching ||
			$createCategoryClient.isPending
	);
</script>

<Metadata title="Transactions History" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Transactions History</CardTitle>

				<Button size="sm" onclick={() => (openSheet = true)}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={transactions}
					paginationState={{ pageIndex: 0, pageSize: 5 }}
					{columns}
					filterKey="name"
				>
					{#snippet deleteBulk(selectedRows)}
						{#if selectedRows.length > 0}
							<DataTableDeletesButton
								selectedRowsCount={selectedRows.length}
								disabled={$deleteTransactionsClient.isPending}
								onDeletes={async () => {
									const ok = await confirm({
										title: 'Are you sure?',
										description: 'You are about to delete these transactions'
									});

									if (ok) {
										const ids = selectedRows.map((r) => r.original.id);
										$deleteTransactionsClient.mutate({ ids });
									}
								}}
							/>
						{/if}
					{/snippet}
				</DataTable>
			</CardContent>
		</Card>
	</div>
</DataTableLoader>

<Sheet
	bind:open={openSheet}
	disabled={loading}
	showDeleteButton={!!$formData.id}
	showDeleteButtonLoader={$deleteTransactionsClient.isPending}
	onOpenChange={(open) => {
		if (!open) form.reset();
	}}
	onDelete={async () => {
		const ok = await confirm({
			title: 'Are you sure?',
			description: 'You are about to delete this transaction'
		});

		if (ok && $formData.id) {
			$deleteTransactionsClient.mutate({ ids: [$formData.id] });
		}
	}}
>
	{#snippet title()}
		{$formData.id ? 'Edit Transaction' : 'New Transaction'}
	{/snippet}

	{#snippet description()}
		{$formData.id ? 'Edit an existing transaction.' : 'Create a new transaction.'}
	{/snippet}

	<TransactionForm
		{form}
		disabled={disabledForm}
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
</Sheet>
