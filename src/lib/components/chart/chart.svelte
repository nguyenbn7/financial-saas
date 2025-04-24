<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { AreaVariant } from '$lib/components/area-variant';
	import FileSearch from '@lucide/svelte/icons/file-search';

	interface Props {
		data?: {
			date: Date;
			income: number;
			expense: number;
		}[];
	}

	let { data }: Props = $props();
</script>

<Card class="border-none drop-shadow-sm">
	<CardHeader class="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
		<CardTitle>Transactions</CardTitle>
		<!-- TODO: Add Select -->
	</CardHeader>

	<CardContent>
		{#if !data || data?.length === 0}
			<div class="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
				<FileSearch class="size-6 text-muted-foreground" />

				<p class="text-muted-foreground text-sm">No data for this period</p>
			</div>
		{:else}
			<AreaVariant {data} />
		{/if}
	</CardContent>
</Card>
