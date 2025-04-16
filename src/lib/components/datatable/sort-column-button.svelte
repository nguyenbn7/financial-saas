<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { SortDirection } from '@tanstack/table-core';

	import { Button } from '$lib/components/ui/button';

	import ArrowDownWideNarrow from '@lucide/svelte/icons/arrow-down-wide-narrow';
	import ArrowUpNarrowWide from '@lucide/svelte/icons/arrow-up-wide-narrow';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';

	interface Props {
		text: string;
		isSorted: false | SortDirection;
	}

	let {
		text,
		isSorted,
		variant = 'ghost',
		...restProps
	}: Props & ComponentProps<typeof Button> = $props();
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
