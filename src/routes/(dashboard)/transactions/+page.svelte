<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import { applyAction } from '$app/forms';

	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { Metadata } from '$lib/components/metadata';
	import { DataTable, DataTableLoader } from '$lib/components/datatable';

	import { transactionFormSchema } from '$features/transactions/schemas';
	import { TransactionSheet } from '$features/transactions/components';
	import { getColumns } from '$features/transactions/datatable-columns';
	import { createDeleteTransactionsClient } from '$features/transactions/api';

	import Plus from '@lucide/svelte/icons/plus';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();

	const transactionForm = superForm(data.form, {
		validators: zodClient(transactionFormSchema),
		async onUpdate({ result }) {
			if (result.status === 401) {
				await applyAction({ type: 'redirect', location: '/sign-in', status: 303 });
				toast.error('Unauthorized');
				return;
			}

			const data = result.data as FormResult<ActionData>;

			transactions = data.transactions as typeof transactions;
		},
		onError() {
			loading = false;
			openSheet = false;
			transactionForm.reset();
		},
		onUpdated({ form }) {
			loading = false;
			openSheet = false;

			if (form.valid) {
				toast.success(form.data.id ? 'Transaction updated' : 'Transaction created');
			}

			transactionForm.reset();
		}
	});

	const { delayed } = transactionForm;

	const deletesClient = createDeleteTransactionsClient();

	let transactions = $state(data.transactions);

	let openSheet = $state(false);

	let loading = $derived($deletesClient.isPending || $delayed);

	const columns = getColumns({
		onEdit(data) {
			openSheet = true;
			transactionForm.form.set({ ...data });
		}
	});

	$effect(() => {
		if ($deletesClient.isSuccess && $deletesClient.data) {
			const { transactions: ts } = $deletesClient.data;
			transactions = ts.map((t) => ({ ...t, date: new Date(t.date) }));

			if ($deletesClient.variables.json.ids.length === 1) {
				openSheet = false;
				toast.success('Transaction deleted');
			} else {
				toast.success('Transactions deleted');
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

<Metadata title="Transactions History" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Transactions History</CardTitle>

				<Button size="sm" onclick={() => (openSheet = true)}>
					<Plus />Add new
				</Button>
			</CardHeader>

			<CardContent>
				<DataTable
					data={transactions}
					paginationState={{ pageIndex: 0, pageSize: 5 }}
					{columns}
					filterKey="name"
				></DataTable>
			</CardContent>
		</Card>
	</div>
</DataTableLoader>

<TransactionSheet
	bind:open={openSheet}
	form={transactionForm}
	disabled={loading}
	deleting={$deletesClient.isPending}
	onOpenChange={(open) => {
		if (!open) transactionForm.reset();
	}}
	onDelete={(id) => {
		$deletesClient.mutate({ json: { ids: [id] }, query: {} });
	}}
/>
