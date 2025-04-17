<script lang="ts">
	import type { PageData } from './$types';

	import { applyAction } from '$app/forms';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { confirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { Sheet } from '$lib/components/sheet';
	import { DataTable, DataTableDeletesButton, DataTableLoader } from '$lib/components/datatable';

	import { getColumns } from '$features/categories/columns';
	import { CategoryForm } from '$features/categories/components';
	import { categoryFormSchema } from '$features/categories/schema';
	import {
		createDeleteCategoriesClient,
		createGetCategoriesClient
	} from '$features/categories/api';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	const getCategoriesClient = createGetCategoriesClient({
		initialData: { categories: data.categories },
		enabled: false
	});

	let openSheet = $state(false);
	let categories = $derived($getCategoriesClient.data.categories);

	const columns = getColumns({
		onEdit(category) {
			openSheet = true;
			const { userId, ...data } = category;
			form.form.set({ ...data });
		}
	});

	const deleteCategoriesClient = createDeleteCategoriesClient({
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				return applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			}
		},
		onSuccess(data, variables, context) {
			if (variables.ids.length === 1) {
				openSheet = false;
				toast.success('Category deleted');
			} else {
				toast.success('Categories deleted');
			}

			$getCategoriesClient.refetch();
		}
	});

	const form = superForm(data.form, {
		validators: zodClient(categoryFormSchema),
		async onUpdate({ form: validatedForm, result }) {
			if (result.status === 401) {
				if (validatedForm.message) {
					toast.error(validatedForm.message);
				}

				return applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			}
		},
		onError({ result }) {
			loading = false;
			openSheet = false;
			form.reset();

			if (result.error.message) toast.error(result.error.message);
		},
		onUpdated({ form: validatedForm }) {
			if (!validatedForm.valid) {
				if (validatedForm.message) toast.error(validatedForm.message);
				return;
			}

			loading = false;
			openSheet = false;
			form.reset();

			if (validatedForm.message) toast.success(validatedForm.message);

			$getCategoriesClient.refetch();
		}
	});

	const { delayed, form: formData } = form;

	let loading = $derived(
		$deleteCategoriesClient.isPending || $delayed || $getCategoriesClient.isFetching
	);
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

<Sheet
	bind:open={openSheet}
	disabled={loading}
	showDeleteButton={!!$formData.id}
	showDeleteButtonLoader={$deleteCategoriesClient.isPending}
	onOpenChange={(open) => {
		if (!open) form.reset();
	}}
	onDelete={async () => {
		const ok = await confirm({
			title: 'Are you sure?',
			description: 'You are about to delete this category'
		});

		if (ok && $formData.id) {
			$deleteCategoriesClient.mutate({ ids: [$formData.id] });
		}
	}}
>
	{#snippet title()}
		{$formData.id ? 'Edit Category' : 'New Category'}
	{/snippet}

	{#snippet description()}
		{$formData.id
			? 'Edit an existing category.'
			: 'Create a new category to organize your transactions.'}
	{/snippet}

	<CategoryForm {form} disabled={loading} disableLoader={$deleteCategoriesClient.isPending} />
</Sheet>
