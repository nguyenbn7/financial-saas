import type { ColumnDef } from '@tanstack/table-core';
import type { Accounts } from '$features/accounts/api';
import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent } from '$lib/components/ui/data-table';
import { CellActions, SortColumnButton } from '$lib/components/datatable';

type Account = ArrayElement<Accounts['accounts']>;

interface Props {
	onEdit?: (account: Account) => MaybePromise<void> | undefined;
}

export function getColumns(props: Props = {}) {
	const { onEdit } = props;

	const columns: ColumnDef<Account>[] = [
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
				renderComponent(SortColumnButton, {
					onclick: () => column.toggleSorting(),
					isSorted: column.getIsSorted(),
					text: 'Name'
				})
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(CellActions, {
					onEdit: () => onEdit?.(row.original)
				})
		}
	];

	return columns;
}
