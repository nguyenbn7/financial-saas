<script lang="ts">
	import type { PageData } from './$types';

	import { goto } from '$app/navigation';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { confirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DataTableDeletesButton, DataTableLoader } from '$lib/components/datatable';

	import { getColumns } from '$features/transactions/columns';
	import {
		createDeleteTransactionsClient,
		createGetTransactionsClient
	} from '$features/transactions/api';
	import { openNewTransactionSheet } from '$features/transactions/components/new-transaction-sheet';
	import { openEditTransactionSheet } from '$features/transactions/components/edit-transaction-sheet';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	const queryClient = useQueryClient();

	const getTransactionsClient = createGetTransactionsClient({
		ssrData: data.transactions
	});

	let transactions = $derived($getTransactionsClient.data?.transactions ?? []);

	const columns = getColumns({
		onEdit: (transaction) => openEditTransactionSheet(transaction.id)
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
			toast.success('Transactions deleted');

			queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });
		}
	});

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
					filterKey="date"
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
