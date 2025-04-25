<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Select, SelectItem, SelectContent, SelectTrigger } from '$lib/components/ui/select';
	import { AreaVariant } from '$features/summary/components/area-variant';
	import { BarVariant } from '$features/summary/components/bar-variant';
	import { LineVariant } from '$features/summary/components/line-variant';
	import FileSearch from '@lucide/svelte/icons/file-search';
	import ChartArea from '@lucide/svelte/icons/chart-area';
	import ChartLine from '@lucide/svelte/icons/chart-line';
	import ChartBar from '@lucide/svelte/icons/chart-bar';

	type ChartType = 'area' | 'bar' | 'line';

	interface Props {
		data?: {
			date: Date;
			income: number;
			expense: number;
		}[];
	}

	let { data }: Props = $props();

	let chartType: ChartType = $state('area');
</script>

{#snippet selectItem({ type }: { type: ChartType })}
	<div class="flex items-center">
		{#if type === 'area'}
			<ChartArea class="size-4 mr-2 shrink-0" />
			<p class="line-clamp-1">Area chart</p>
		{:else if type === 'line'}
			<ChartLine class="size-4 mr-2 shrink-0" />
			<p class="line-clamp-1">Line chart</p>
		{:else}
			<ChartBar class="size-4 mr-2 shrink-0" />
			<p class="line-clamp-1">Bar chart</p>
		{/if}
	</div>
{/snippet}

<Card class="border-none drop-shadow-sm">
	<CardHeader class="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
		<CardTitle>Transactions</CardTitle>

		<Select type="single" bind:value={chartType}>
			<SelectTrigger class="lg:w-auto h-9 rounded-md px-3">
				{@render selectItem({ type: chartType })}
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="area">
					{@render selectItem({ type: 'area' })}
				</SelectItem>
				<SelectItem value="line">
					{@render selectItem({ type: 'line' })}
				</SelectItem>
				<SelectItem value="bar">
					{@render selectItem({ type: 'bar' })}
				</SelectItem>
			</SelectContent>
		</Select>
	</CardHeader>

	<CardContent>
		{#if !data || data?.length === 0}
			<div class="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
				<FileSearch class="size-6 text-muted-foreground" />

				<p class="text-muted-foreground text-sm">No data for this period</p>
			</div>
		{:else if chartType === 'area'}
			<AreaVariant {data} />
		{:else if chartType === 'line'}
			<LineVariant {data} />
		{:else}
			<BarVariant {data} />
		{/if}
	</CardContent>
</Card>
