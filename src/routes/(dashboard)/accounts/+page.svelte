<script lang="ts">
	import type { FormResult } from 'sveltekit-superforms';
	import type { ActionData, PageData } from './$types';

	import { applyAction } from '$app/forms';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DataTableDeletesButton, DataTableLoader } from '$lib/components/datatable';

	import { getColumns } from '$features/accounts/columns';
	import { accountFormSchema } from '$features/accounts/schema';
	import { AccountSheet } from '$features/accounts/components';
	import { createDeleteAccountsClient, createGetAccountsClient } from '$features/accounts/api';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	let openSheet = $state(false);
	let accounts = $state(data.accounts);

	const columns = getColumns({
		onEdit(account) {
			openSheet = true;
			const { userId, ...data } = account;
			form.form.set({ ...data });
		}
	});

	const deletesClient = createDeleteAccountsClient({
		onSuccess(data, variables, context) {
			const { accounts: newAccounts } = data;

			accounts = newAccounts;

			if (variables.ids.length === 1) {
				openSheet = false;
				toast.success('Account deleted');
			} else {
				toast.success('Accounts deleted');
			}
		},
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				return applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			}
		}
	});

	const form = superForm(data.form, {
		validators: zodClient(accountFormSchema),
		async onUpdate({ form: validatedForm, result }) {
			if (result.status === 401) {
				if (validatedForm.message) {
					toast.error(validatedForm.message);
				}
				return applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
			}

			const { accounts: newAccounts } = result.data as FormResult<ActionData>;

			if (newAccounts) {
				accounts = newAccounts;
			}
		},
		onError({ result }) {
			loading = false;
			openSheet = false;
			form.reset();

			if (result.error.message) toast.error(result.error.message);
		},
		onUpdated({ form: validatedForm }) {
			if (!validatedForm.valid) return;

			loading = false;
			openSheet = false;
			form.reset();

			if (validatedForm.message) toast.success(validatedForm.message);
		}
	});

	const { delayed } = form;

	let loading = $derived($deletesClient.isPending || $delayed);
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
					paginationState={{ pageIndex: 0, pageSize: 5 }}
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
	{form}
	bind:open={openSheet}
	disabled={loading}
	deleting={$deletesClient.isPending}
	onOpenChange={(open) => {
		if (!open) form.reset();
	}}
	onDelete={(id) => $deletesClient.mutate({ ids: [id] })}
/>
