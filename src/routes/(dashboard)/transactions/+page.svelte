<script lang="ts">
	import type { PageData } from './$types';

	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { AddNewButton } from '$lib/components/button';
	import { confirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DeleteBulkButton, DataTableLoader } from '$lib/components/datatable';

	import { INITIAL_IMPORT_RESULTS, VARIANTS } from '$features/transactions';
	import { ImportCard, UploadButton } from '$features/transactions/components';
	import { useNewTransaction } from '$features/transactions/hooks/use-new-transaction';
	import { useEditTransaction } from '$features/transactions/hooks/use-edit-transaction';
	import { createTransactionDataTableColumns } from '$features/transactions/columns';
	import {
		createDeleteTransactionsClient,
		createGetTransactionsClient
	} from '$features/transactions/api';

	interface PageProps {
		data: PageData;
	}

	const { onOpen: openNewTransactionSheet } = useNewTransaction();
	const { onOpen: openEditTransactionSheet } = useEditTransaction();

	let { data }: PageProps = $props();

	const getTransactionsClient = createGetTransactionsClient({
		ssrData: [...data.transactions]
	});
	const deleteTransactionsClient = createDeleteTransactionsClient();

	const columns = createTransactionDataTableColumns({
		onEdit(transaction) {
			openEditTransactionSheet(transaction.id);
		},
		async onDelete(transaction) {
			const ok = await confirm({
				title: 'Are you sure?',
				description: 'You are about to delete this transaction'
			});

			if (ok) {
				$deleteTransactionsClient.mutate({ ids: [transaction.id] });
			}
		}
	});

	let transactions = $derived($getTransactionsClient.data.transactions);

	let loading = $derived($deleteTransactionsClient.isPending || $getTransactionsClient.isFetching);

	let variant = $state<'LIST' | 'IMPORT'>(VARIANTS.LIST);
	let importResults = $state(INITIAL_IMPORT_RESULTS);

	function onCancelImport() {
		importResults = INITIAL_IMPORT_RESULTS;
		variant = VARIANTS.LIST;
	}
</script>

<Metadata title="Transactions History" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		{#if variant === VARIANTS.IMPORT}
			<ImportCard
				data={importResults.data as string[][]}
				onCancel={onCancelImport}
				onSubmit={() => {}}
			/>
		{:else}
			<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
				<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
					<CardTitle class="text-xl line-clamp-1">Transactions History</CardTitle>

					<div class="flex items-center gap-x-2">
						<AddNewButton onclick={openNewTransactionSheet} />

						<UploadButton
							onUpload={(results) => {
								variant = VARIANTS.IMPORT;
								importResults = results;
							}}
						/>
					</div>
				</CardHeader>

				<CardContent>
					<DataTable
						data={transactions}
						paginationState={{ pageIndex: 0, pageSize: 5 }}
						{columns}
						filterKey="payee"
					>
						{#snippet SelectedRowAction(selectedRows)}
							{#if selectedRows.length > 0}
								<DeleteBulkButton
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
		{/if}
	</div>
</DataTableLoader>
