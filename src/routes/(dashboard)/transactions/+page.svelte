<script lang="ts">
	import type { PageServerData } from './$types';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { Transaction as TransactionModel } from '$lib/db.schemas';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$components/ui/button';
	import { Checkbox } from '$components/ui/checkbox';
	import { renderComponent } from '$components/ui/data-table';
	import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card';

	import {
		DataTable,
		DataTableLoader,
		DataTableRowActions,
		DataTableSortColumn
	} from '$components/datatable';
	import Metadata from '$components/metadata.svelte';

	import { insertTransactionSchema } from '$features/transactions/transactions.schemas';
	import TransactionSheet from '$features/transactions/components/transaction-sheet.svelte';

	import { Plus } from '@lucide/svelte';

	type Transaction = Omit<
		TransactionModel & { account: string; category: string | null },
		'accountId' | 'categoryId'
	>;

	type PageProps = { data: PageServerData };

	let { data }: PageProps = $props();

	const createForm = superForm(data.createForm, {
		validators: zodClient(insertTransactionSchema)
	});

	let transactions = $state(data.data);
	let accountOptions = $state(data.accountOptions);

	let loading = $state(false);
	let open = $state(false);

	const columns: ColumnDef<Transaction>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'name',
			header: ({ column }) =>
				renderComponent(DataTableSortColumn, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Name'
				})
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(DataTableRowActions, {
					onEdit() {}
				})
		}
	];
</script>

<Metadata title="Transactions History" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Transactions History</CardTitle>

				<Button size="sm" onclick={() => (open = true)}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={transactions}
					paginationState={{ pageIndex: 0, pageSize: 5 }}
					{columns}
					filterKey="name"
				></DataTable>
			</CardContent>
		</Card>
	</div>
</DataTableLoader>

<TransactionSheet {open} {accountOptions} form={createForm} />
