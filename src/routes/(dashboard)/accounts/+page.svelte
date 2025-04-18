<script lang="ts">
	import type { PageData } from './$types';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { confirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DeleteBulkButton, DataTableLoader } from '$lib/components/datatable';

	import { useNewAccount } from '$features/accounts/hooks/use-new-account';
	import { useEditAccount } from '$features/accounts/hooks/use-edit-account';
	import { createAccountDataTableColumns } from '$features/accounts/columns';
	import { createDeleteAccountsClient, createGetAccountsClient } from '$features/accounts/api';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	const { onOpen: openNewAccountSheet } = useNewAccount();
	const { onOpen: openEditAccountSheet } = useEditAccount();

	let { data }: PageProps = $props();

	const getAccountsClient = createGetAccountsClient({ ssrData: [...data.accounts] });
	const deleteAccountsClient = createDeleteAccountsClient();

	const columns = createAccountDataTableColumns({
		onEdit(account) {
			openEditAccountSheet(account.id);
		},
		async onDelete(account) {
			const ok = await confirm({
				title: 'Are you sure?',
				description: 'You are about to delete this account'
			});

			if (ok) {
				$deleteAccountsClient.mutate({ ids: [account.id] });
			}
		}
	});

	let accounts = $derived($getAccountsClient.data.accounts);

	let loading = $derived($deleteAccountsClient.isPending || $getAccountsClient.isFetching);
</script>

<Metadata title="Financial Accounts" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Accounts page</CardTitle>

				<Button size="sm" onclick={openNewAccountSheet}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={accounts}
					paginationState={{ pageIndex: 0, pageSize: 5 }}
					{columns}
					filterKey="name"
				>
					{#snippet SelectedRowAction(selectedRows)}
						{#if selectedRows.length > 0}
							<DeleteBulkButton
								selectedRowsCount={selectedRows.length}
								disabled={$deleteAccountsClient.isPending}
								onDeletes={async () => {
									const ok = await confirm({
										title: 'Are you sure?',
										description: 'You are about to delete these accounts'
									});

									if (ok) {
										const ids = selectedRows.map((r) => r.original.id);
										$deleteAccountsClient.mutate({ ids });
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
