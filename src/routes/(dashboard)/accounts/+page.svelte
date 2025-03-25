<script lang="ts">
	import type { FormResult } from 'sveltekit-superforms';
	import type { ActionData, PageServerData } from './$types';

	import { applyAction } from '$app/forms';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';

	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DataTableDeletesButton, DataTableLoader } from '$lib/components/datatable';

	import { AccountSheet } from '$features/accounts/components';
	import { getColumns } from '$features/accounts/datatable-columns';
	import { accountFormSchema } from '$features/accounts/schemas';
	import { deleteAccounts } from '$features/accounts/api';

	import { Plus } from '@lucide/svelte';

	interface PageProps {
		data: PageServerData;
	}

	let { data }: PageProps = $props();

	const accountForm = superForm(data.form, {
		validators: zodClient(accountFormSchema),
		async onUpdate({ result }) {
			if (result.status === 401) {
				await applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
				toast.error('Unauthorized');
				return;
			}

			const { pagination } = result.data as FormResult<ActionData>;

			if (pagination) {
				accounts = pagination.data;
				page = pagination.page;
				pageSize = pagination.pageSize;
			}
		},
		onError() {
			loading = false;
			openSheet = false;
			accountForm.reset();
		},
		onUpdated({ form }) {
			loading = false;
			openSheet = false;

			if (form.valid) {
				toast.success(form.data.id ? 'Account updated' : 'Account created');
			}

			accountForm.reset();
		}
	});

	const { delayed } = accountForm;

	const deletesClient = deleteAccounts();

	let page = $state(data.pagination.page);
	let accounts = $state(data.pagination.data);
	let pageSize = $state(data.pagination.pageSize);

	let openSheet = $state(false);

	let loading = $derived($deletesClient.isPending || $delayed);

	const columns = getColumns({
		onEdit(data) {
			openSheet = true;
			accountForm.form.set({ ...data });
		}
	});

	$effect(() => {
		if ($deletesClient.isSuccess && $deletesClient.data) {
			const { pagination } = $deletesClient.data;
			accounts = pagination.data;
			page = pagination.page;
			pageSize = pagination.pageSize;

			if ($deletesClient.variables.ids.length === 1) {
				openSheet = false;
				toast.success('Account deleted');
			} else {
				toast.success('Accounts deleted');
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

<Metadata title="Financial Accounts" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Accounts page</CardTitle>

				<Button size="sm" onclick={() => (openSheet = true)}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={accounts}
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
								confirmDialogDescription="You are about to delete these accounts"
							/>
						{/if}
					{/snippet}
				</DataTable>
			</CardContent>
		</Card>
	</div>
</DataTableLoader>

<AccountSheet
	form={accountForm}
	bind:open={openSheet}
	disabled={loading}
	deleting={$deletesClient.isPending}
	onOpenChange={(open) => {
		if (!open) accountForm.reset();
	}}
	onDelete={(id) => {
		$deletesClient.mutate({ ids: [id] });
	}}
/>
