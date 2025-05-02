<script lang="ts">
	import type { PageData } from './$types';

	import Plus from '@lucide/svelte/icons/plus';

	import { useDeleteAccounts, useGetAccounts } from '$features/accounts/api';
	import { createAccountDataTableColumns } from '$features/accounts/columns';
	import { useNewAccount } from '$features/accounts/components/new-account-sheet';
	import { useEditAccount } from '$features/accounts/components/edit-account-sheet';

	import { useConfirm } from '$lib/components/confirm-dialog';
	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DeleteBulkButton, DataTableLoader } from '$lib/components/datatable';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface PageProps {
		data: PageData;
	}

	const { onOpen: openNewAccountSheet } = useNewAccount();
	const { onOpen: openEditAccountSheet } = useEditAccount();
	const { confirm } = useConfirm();

	const { data }: PageProps = $props();

	const getAccountsClient = useGetAccounts({ accounts: data.accounts });
	const deleteAccountsClient = useDeleteAccounts();

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

	const accounts = $derived($getAccountsClient.data.accounts);

	const loading = $derived($deleteAccountsClient.isPending || $getAccountsClient.isFetching);
</script>

<Metadata title="Financial Accounts" />

<DataTableLoader {loading}>
	<div class="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm">
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
