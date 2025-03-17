<script lang="ts">
	import type { ActionResult } from '@sveltejs/kit';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ActionData, PageServerData } from './$types';
	import type { Category as CategoryModel } from '$lib/db.schemas';
	import type { CategoryForms } from '$features/categories/components/category-form.svelte';

	import { applyAction } from '$app/forms';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm, type FormResult } from 'sveltekit-superforms';

	import { toast } from 'svelte-sonner';
	import { Button } from '$components/ui/button';
	import { Checkbox } from '$components/ui/checkbox';
	import { renderComponent } from '$components/ui/data-table';
	import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card';

	import Metadata from '$components/metadata.svelte';
	import {
		DataTable,
		DataTableDeletesButton,
		DataTableLoader,
		DataTableRowActions,
		DataTableSortColumn
	} from '$components/datatable';

	import CategorySheet from '$features/categories/components/category-sheet.svelte';
	import {
		insertCategorySchema,
		updateCategorySchema
	} from '$features/categories/categories.schemas';

	import { Plus } from '@lucide/svelte';

	type Category = Omit<CategoryModel, 'userId'>;

	type OnUpdateParams = { result: Extract<ActionResult, { type: 'success' | 'failure' }> };

	type PageProps = { data: PageServerData };

	async function onUpdate({ result }: OnUpdateParams) {
		if (result.status === 401) {
			await applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			toast.error('Unauthorized');
			return;
		}

		const { pagination } = result.data as FormResult<ActionData>;

		if (pagination) {
			updatePagination(pagination);
		}
	}

	function updatePagination(pagination: Pagination<Category>) {
		categories = pagination.data;
		page = pagination.page;
		pageSize = pagination.pageSize;
	}

	function openSheet(form: CategoryForms, data?: Category) {
		open = true;
		if (data) form.form.set(data);
		currentForm = form;
	}

	function closeSheet() {
		open = false;
		currentForm.reset();
	}

	function onError() {
		loading = false;
		closeSheet();
	}

	let { data }: PageProps = $props();

	const createForm = superForm(data.createForm, {
		validators: zodClient(insertCategorySchema),
		onUpdate,
		onError,
		onUpdated({ form }) {
			loading = false;
			closeSheet();

			if (form.message) {
				toast.success(form.message);
			}
		}
	});

	const updateForm = superForm(data.updateForm, {
		validators: zodClient(updateCategorySchema),
		onUpdate,
		onError,
		onUpdated({ form }) {
			loading = false;
			closeSheet();

			if (form.message) {
				toast.success(form.message);
			}
		}
	});

	const deletesForm = superForm(data.deletesForm, {
		dataType: 'json',
		onSubmit() {
			setTimeout(() => (loading = true), 500);
		},
		onError() {
			loading = false;
		},
		onUpdate,
		onUpdated({ form }) {
			loading = false;

			if (form.message) {
				toast.success(form.message);
			}
		}
	});

	let page = $state(data.pagination.page);
	let categories = $state(data.pagination.data);
	let pageSize = $state(data.pagination.pageSize);

	let open = $state(false);
	let currentForm: CategoryForms = $state(createForm);

	const { delayed: isCreating } = createForm;
	const { delayed: isUpdating } = updateForm;

	let loading = $derived($isCreating || $isUpdating);

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
					onEdit: () => openSheet(updateForm, row.original)
				})
		}
	];
</script>

<Metadata title="Financial Categories" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Categories page</CardTitle>

				<Button size="sm" onclick={() => openSheet(createForm)}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={categories}
					paginationState={{ pageIndex: page - 1, pageSize }}
					{columns}
					filterKey="name"
				>
					{#snippet deleteBulk(selectedRows)}
						<DataTableDeletesButton
							{selectedRows}
							form={deletesForm}
							onUpdate={(selectedRows) => {
								deletesForm.form.update(() => ({ ids: selectedRows.map((r) => r.original.id) }));
							}}
							alertDialogDescription="You are about to delete these categories"
						/>
					{/snippet}
				</DataTable>
			</CardContent>
		</Card>
	</div>
</DataTableLoader>

<CategorySheet form={currentForm} bind:open disabled={loading} />
