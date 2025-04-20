<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import ImportTable from './import-table.svelte';

	interface Props {
		data: string[][];
		onCancel: () => void;
		onSubmit: (data: any) => void;
	}

	const dateFormat = 'yyyy-MM-dd HH:mm:ss';
	const outputFormat = 'yyyy-MM-dd';

	const requiredOptions = ['amount', 'date', 'payee'];

	interface SelectedColumnState {
		[key: string]: string | null;
	}

	let { data, onCancel, onSubmit }: Props = $props();

	let selectedColumns = $state<SelectedColumnState>({});

	const headers = data[0];
	const body = data.slice(1);

	function onTableHeadSelectChange(columnIndex: number, value: string | null) {
		const newSelectedColumns = { ...selectedColumns };

		for (const key in newSelectedColumns) {
			if (newSelectedColumns[key] === value) {
				newSelectedColumns[key] = null;
			}
		}

		if (value === 'skip') value = null;

		newSelectedColumns[`column_${columnIndex}`] = value;

		selectedColumns = { ...newSelectedColumns };
	}

	$inspect(selectedColumns);
</script>

<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
	<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
		<CardTitle class="text-xl line-clamp-1">Import Transaction</CardTitle>

		<Button size="sm" onclick={onCancel}>Cancel</Button>
	</CardHeader>

	<CardContent>
		<ImportTable {headers} {body} {selectedColumns} {onTableHeadSelectChange} />
	</CardContent>
</Card>
