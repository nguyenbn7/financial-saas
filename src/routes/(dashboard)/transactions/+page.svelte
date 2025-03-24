<script lang="ts">
	import type { PageServerData } from './$types';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	import { DataTable, DataTableLoader } from '$lib/components/datatable';
	import Metadata from '$lib/components/metadata/metadata.svelte';

	import { transactionFormSchema } from '$features/transactions/schemas';
	import { TransactionSheet } from '$features/transactions/components';
	import { getColumns } from '$features/transactions/datatable-columns';

	import { Plus } from '@lucide/svelte';

	interface PageProps {
		data: PageServerData;
	}

	let { data }: PageProps = $props();

	const transactionForm = superForm(data.form, {
		validators: zodClient(transactionFormSchema)
	});

	let transactions = $state(data.data);
	let open = $state(false);

	let loading = $state(false);
	const columns = getColumns({});
</script>

<Metadata title="Transactions History" />

<DataTableLoader {loading}>
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
			<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
				<CardTitle class="text-xl line-clamp-1">Transactions History</CardTitle>

				<Button size="sm" onclick={() => (open = true)}>
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

<TransactionSheet bind:open form={transactionForm} accountOptions={[]} />
