<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Select, SelectItem, SelectContent, SelectTrigger } from '$lib/components/ui/select';
	import { PieVariant } from '$features/summary/components/pie-variant';
	import { RadarVariant } from '$features/summary/components/radar-variant';
	import { RadialVariant } from '$features/summary/components/radial-variant';
	import FileSearch from '@lucide/svelte/icons/file-search';
	import ChartPie from '@lucide/svelte/icons/chart-pie';
	import Radar from '@lucide/svelte/icons/radar';
	import Target from '@lucide/svelte/icons/target';

	type ChartType = 'pie' | 'radar' | 'radial';

	interface Props {
		data?: {
			name: string;
			value: number;
		}[];
	}

	let { data }: Props = $props();

	let chartType: ChartType = $state('pie');
</script>

{#snippet selectItem({ type }: { type: ChartType })}
	<div class="flex items-center">
		{#if type === 'pie'}
			<ChartPie class="size-4 mr-2 shrink-0" />
			<p class="line-clamp-1">Pie chart</p>
		{:else if type === 'radar'}
			<Radar class="size-4 mr-2 shrink-0" />
			<p class="line-clamp-1">Radar chart</p>
		{:else}
			<Target class="size-4 mr-2 shrink-0" />
			<p class="line-clamp-1">Radial chart</p>
		{/if}
	</div>
{/snippet}

<Card class="border-none drop-shadow-sm">
	<CardHeader class="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
		<CardTitle>Categories</CardTitle>

		<Select type="single" bind:value={chartType}>
			<SelectTrigger class="lg:w-auto h-9 rounded-md px-3">
				{@render selectItem({ type: chartType })}
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="pie">
					{@render selectItem({ type: 'pie' })}
				</SelectItem>
				<SelectItem value="radar">
					{@render selectItem({ type: 'radar' })}
				</SelectItem>
				<SelectItem value="radial">
					{@render selectItem({ type: 'radial' })}
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
		{:else if chartType === 'pie'}
			<PieVariant {data} />
		{:else if chartType === 'radar'}
			<RadarVariant {data} />
		{:else}
			<RadialVariant {data} />
		{/if}
	</CardContent>
</Card>
