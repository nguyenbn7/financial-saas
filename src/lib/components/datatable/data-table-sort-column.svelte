<script lang="ts" module>
	import type { ComponentProps } from 'svelte';

	export type DataTableSortColumnProps = ComponentProps<typeof Button> & {
		text: string;
		isSorted: false | SortDirection;
	};
</script>

<script lang="ts">
	import type { SortDirection } from '@tanstack/table-core';

	import { Button } from '$lib/components/ui/button';

	import { ArrowDownWideNarrow, ArrowUpNarrowWide, ArrowUpDown } from '@lucide/svelte';

	let { text, isSorted, variant = 'ghost', ...restProps }: DataTableSortColumnProps = $props();
</script>

<Button {variant} {...restProps}>
	{text}
	{#if isSorted === 'asc'}
		<ArrowUpNarrowWide class="ml-1" />
	{:else if isSorted === 'desc'}
		<ArrowDownWideNarrow class="ml-1" />
	{:else}
		<ArrowUpDown class="ml-1" />
	{/if}
</Button>
