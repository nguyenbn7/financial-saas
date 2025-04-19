<script lang="ts">
	import type { PageData } from './$types';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { confirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DeleteBulkButton, DataTableLoader } from '$lib/components/datatable';

	import { useNewTransaction } from '$features/transactions/hooks/use-new-transaction';
	import { useEditTransaction } from '$features/transactions/hooks/use-edit-transaction';
	import { createTransactionDataTableColumns } from '$features/transactions/columns';
	import {
		createDeleteTransactionsClient,
		createGetTransactionsClient
	} from '$features/transactions/api';

	import Plus from '@lucide/svelte/icons/plus';

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
</script>

<Metadata title="Transactions History" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Transactions History</CardTitle>

				<Button size="sm" onclick={openNewTransactionSheet}>
					<Plus />Add new
				</Button>
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
	</div>
</DataTableLoader>
