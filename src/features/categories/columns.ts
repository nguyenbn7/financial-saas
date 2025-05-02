import type { ColumnDef } from '@tanstack/table-core';
import type { Categories } from '$features/categories/api';

import { CellActions, SortColumnButton } from '$lib/components/datatable';

import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent } from '$lib/components/ui/data-table';

type Category = ArrayElement<Categories>;

interface Params {
	onEdit?: (category: Category) => MaybePromise<void> | undefined;
	onDelete?: (category: Category) => MaybePromise<void> | undefined;
}

export function createCategoryDataTableColumns(params: Params = {}) {
	const { onEdit, onDelete } = params;

	const columns: ColumnDef<Category>[] = [
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
					onEdit: () => onEdit?.(row.original),
					onDelete: () => onDelete?.(row.original)
				})
		}
	];

	return columns;
}
