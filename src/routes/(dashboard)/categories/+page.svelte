<script lang="ts">
	import type { FormResult } from 'sveltekit-superforms';
	import type { ActionData, PageServerData } from './$types';

	import { applyAction } from '$app/forms';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DataTableDeletesButton, DataTableLoader } from '$lib/components/datatable';

	import { getColumns } from '$features/categories/datatable-columns';
	import { CategorySheet } from '$features/categories/components';
	import { categoryFormSchema } from '$features/categories/schemas';
	import { deleteCategories } from '$features/categories/api';

	import { Plus } from '@lucide/svelte';

	interface PageProps {
		data: PageServerData;
	}

	let { data }: PageProps = $props();

	const categoriesForm = superForm(data.form, {
		validators: zodClient(categoryFormSchema),
		async onUpdate({ result }) {
			if (result.status === 401) {
				await applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
				toast.error('Unauthorized');
				return;
			}

			const { pagination } = result.data as FormResult<ActionData>;

			if (pagination) {
				categories = pagination.data;
				page = pagination.page;
				pageSize = pagination.pageSize;
			}
		},
		onError() {
			loading = false;
			openSheet = false;
			categoriesForm.reset();
		},
		onUpdated({ form }) {
			loading = false;
			openSheet = false;

			if (form.valid) {
				toast.success(form.data.id ? 'Category updated' : 'Category created');
			}

			categoriesForm.reset();
		}
	});

	const { delayed } = categoriesForm;

	const deletesClient = deleteCategories();

	let page = $state(data.pagination.page);
	let categories = $state(data.pagination.data);
	let pageSize = $state(data.pagination.pageSize);

	let openSheet = $state(false);

	let loading = $derived($deletesClient.isPending || $delayed);

	const columns = getColumns({
		onEdit(data) {
			openSheet = true;
			categoriesForm.form.set({ ...data });
		}
	});

	$effect(() => {
		if ($deletesClient.isSuccess && $deletesClient.data) {
			const { pagination } = $deletesClient.data;
			categories = pagination.data;
			page = pagination.page;
			pageSize = pagination.pageSize;

			if ($deletesClient.variables.ids.length === 1) {
				openSheet = false;
				toast.success('Category deleted');
			} else {
				toast.success('Categories deleted');
			}
		} else if ($deletesClient.error) {
			const { message, status } = $deletesClient.error;

			if (status === 401) {
				toast.error(message);
				applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
				return;
			}
		}
	});
</script>

<Metadata title="Financial Categories" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Categories page</CardTitle>

				<Button size="sm" onclick={() => (openSheet = true)}>
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
						{#if selectedRows.length > 0}
							<DataTableDeletesButton
								selectedRowsCount={selectedRows.length}
								disabled={$deletesClient.isPending}
								onDeletes={() => {
									const ids = selectedRows.map((r) => r.original.id);
									$deletesClient.mutate({ ids });
								}}
								confirmDialogDescription="You are about to delete these categories"
							/>
						{/if}
					{/snippet}
				</DataTable>
			</CardContent>
		</Card>
	</div>
</DataTableLoader>

<CategorySheet
	form={categoriesForm}
	bind:open={openSheet}
	disabled={loading}
	deleting={$deletesClient.isPending}
	onOpenChange={(open) => {
		if (!open) categoriesForm.reset();
	}}
	onDelete={(id) => {
		$deletesClient.mutate({ ids: [id] });
	}}
/>
