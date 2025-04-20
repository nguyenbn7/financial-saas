<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import TableHeadSelect from './table-head-select.svelte';

	interface Props {
		headers: string[];
		body: string[][];
		selectedColumns: Record<string, string | null>;
		onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
	}

	let { headers, body, selectedColumns, onTableHeadSelectChange }: Props = $props();
</script>

<div class="rounded-md border overflow-hidden">
	<Table>
		<TableHeader class="bg-muted">
			<TableRow>
				{#each headers as _item, index (index)}
					<TableHead>
						<TableHeadSelect
							columnIndex={index}
							{selectedColumns}
							onChange={onTableHeadSelectChange}
						/>
					</TableHead>
				{/each}
			</TableRow>
		</TableHeader>

		<TableBody>
			{#each body as row, index (index)}
				<TableRow>
					{#each row as cell, idx (idx)}
						<TableCell>
							{cell}
						</TableCell>
					{/each}
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
