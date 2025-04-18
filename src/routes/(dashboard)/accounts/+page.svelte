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

	import { getColumns } from '$features/accounts/columns';
	import { createDeleteAccountsClient, createGetAccountsClient } from '$features/accounts/api';
	import { openNewAccountSheet } from '$features/accounts/components/new-account-sheet';
	import { openEditAccountSheet } from '$features/accounts/components/edit-account-sheet';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	const queryClient = useQueryClient();

	const getAccountsClient = createGetAccountsClient({ ssrData: [...data.accounts] });

	let accounts = $derived($getAccountsClient.data.accounts);

	const columns = getColumns({
		onEdit: (account) => openEditAccountSheet(account.id)
	});

	const deleteAccountsClient = createDeleteAccountsClient({
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
					{#snippet deleteBulk(selectedRows)}
						{#if selectedRows.length > 0}
							<DataTableDeletesButton
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
