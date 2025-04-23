<script lang="ts">
	import type { PageData } from './$types';

	import { useConfirm } from '$lib/hooks/use-confirm-dialog';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DeleteBulkButton, DataTableLoader } from '$lib/components/datatable';

	import { useNewCategory } from '$features/categories/hooks/use-new-category';
	import { useEditCategory } from '$features/categories/hooks/use-edit-category';
	import { createCategoryDataTableColumns } from '$features/categories/columns';
	import {
		createDeleteCategoriesClient,
		createGetCategoriesClient
	} from '$features/categories/api';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	const { onOpen: openNewCategorySheet } = useNewCategory();
	const { onOpen: openEditCategorySheet } = useEditCategory();
	const { confirm } = useConfirm();

	let { data }: PageProps = $props();

	const getCategoriesClient = createGetCategoriesClient({ categories: data.categories });
	const deleteCategoriesClient = createDeleteCategoriesClient();

	const columns = createCategoryDataTableColumns({
		onEdit: (category) => openEditCategorySheet(category.id),
		async onDelete(category) {
			const ok = await confirm({
				title: 'Are you sure?',
				description: 'You are about to delete this category'
			});

			if (ok) {
				$deleteCategoriesClient.mutate({ ids: [category.id] });
			}
		}
	});

	let categories = $derived($getCategoriesClient.data.categories);

	let loading = $derived($deleteCategoriesClient.isPending || $getCategoriesClient.isFetching);
</script>

<Metadata title="Financial Categories" />

<DataTableLoader {loading}>
	<div class="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Categories page</CardTitle>

				<Button size="sm" onclick={openNewCategorySheet}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={categories}
					paginationState={{ pageIndex: 0, pageSize: 5 }}
					{columns}
					filterKey="name"
				>
					{#snippet SelectedRowAction(selectedRows)}
						{#if selectedRows.length > 0}
							<DeleteBulkButton
								selectedRowsCount={selectedRows.length}
								disabled={$deleteCategoriesClient.isPending}
								onDeletes={async () => {
									const ok = await confirm({
										title: 'Are you sure?',
										description: 'You are about to delete these categories'
									});

									if (ok) {
										const ids = selectedRows.map((r) => r.original.id);
										$deleteCategoriesClient.mutate({ ids });
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
