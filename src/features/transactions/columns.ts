import type { ColumnDef } from '@tanstack/table-core';
import type { Transactions } from '$features/transactions/api';

import { AccountColumn, AmountBadge, CategoryColumn } from '$features/transactions/components';

import { CellActions, SortColumnButton } from '$lib/components/datatable';

import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent } from '$lib/components/ui/data-table';

import { format } from 'date-fns';

type Transaction = ArrayElement<Transactions>;

interface Params {
	onEdit?: (transaction: Transaction) => MaybePromise<unknown> | null | undefined;
	onDelete?: (transaction: Transaction) => MaybePromise<unknown> | null | undefined;
}

export function createTransactionDataTableColumns(params: Params = {}) {
	const { onEdit, onDelete } = params;

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
			accessorKey: 'date',
			header: ({ column }) =>
				renderComponent(SortColumnButton, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Date'
				}),
			cell: ({ row }) => {
				const { date } = row.original;
				return format(date, 'dd MMMM, yyyy');
			}
		},
		{
			accessorKey: 'category',
			header: ({ column }) =>
				renderComponent(SortColumnButton, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Category'
				}),
			cell: ({ row }) => {
				const { category, id, categoryId } = row.original;
				return renderComponent(CategoryColumn, {
					id,
					category,
					categoryId
				});
			}
		},
		{
			accessorKey: 'payee',
			header: ({ column }) =>
				renderComponent(SortColumnButton, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Payee'
				})
		},
		{
			accessorKey: 'amount',
			header: ({ column }) =>
				renderComponent(SortColumnButton, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Amount'
				}),
			cell: ({ row }) => {
				const { amount } = row.original;
				return renderComponent(AmountBadge, { amount });
			}
		},
		{
			accessorKey: 'account',
			header: ({ column }) =>
				renderComponent(SortColumnButton, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Account'
				}),
			cell: ({ row }) => {
				const { account, accountId } = row.original;
				return renderComponent(AccountColumn, {
					account,
					accountId
				});
			}
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(CellActions, {
					onEdit: () => onEdit?.(row.original),
					onDelete: () => onDelete?.(row.original)
				})
		}
	];

	return columns;
}
