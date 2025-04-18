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

	import { getColumns } from '$features/categories/columns';
	import {
		createDeleteCategoriesClient,
		createGetCategoriesClient
	} from '$features/categories/api';
	import { openNewCategorySheet } from '$features/categories/components/new-category-sheet';
	import { openEditCategorySheet } from '$features/categories/components/edit-category-sheet';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	const queryClient = useQueryClient();

	const getCategoriesClient = createGetCategoriesClient({ ssrData: [...data.categories] });

	let categories = $derived($getCategoriesClient.data.categories);

	const columns = getColumns({
		onEdit: (category) => openEditCategorySheet(category.id)
	});

	const deleteCategoriesClient = createDeleteCategoriesClient({
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				queryClient.invalidateQueries({ queryKey: ['get', 'accounts'], type: 'inactive' });

				return goto('/sign-in', { invalidateAll: true });
			}
		},
		onSuccess() {
			toast.success('Accounts deleted');

			queryClient.invalidateQueries({ queryKey: ['get', 'accounts'] });
		}
	});

	let loading = $derived($deleteCategoriesClient.isPending || $getCategoriesClient.isFetching);
</script>

<Metadata title="Financial Categories" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
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
					{#snippet deleteBulk(selectedRows)}
						{#if selectedRows.length > 0}
							<DataTableDeletesButton
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
