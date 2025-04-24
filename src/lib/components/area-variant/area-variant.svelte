<script lang="ts">
	import { format } from 'date-fns';
	import { formatCurrency } from '$lib';
	import { curveCatmullRom } from 'd3-shape';
	import { Chart, Svg, Tooltip, Axis, Area, Highlight } from 'layerchart';

	interface Props {
		data: {
			date: Date;
			income: number;
			expense: number;
		}[];
	}

	let { data }: Props = $props();
</script>

<div class="h-80 overflow-visible ps-10">
	<Chart
		{data}
		x="date"
		y={['income', 'expense']}
		yNice
		padding={{ bottom: 20, left: 20, right: 20, top: 10 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		<Svg>
			<Axis
				placement="left"
				format={(d: number) => formatCurrency(d)}
				rule={{ class: 'stroke-muted' }}
				grid={{ class: 'stroke-muted' }}
				tickLabelProps={{
					class: 'text-xs fill-foreground font-medium'
				}}
			/>
			<Axis
				placement="bottom"
				format={(d: Date) => format(d, 'dd MMM')}
				rule={{ class: 'stroke-muted' }}
				tickLabelProps={{
					textAnchor: 'end',
					class: 'text-xs fill-foreground font-medium'
				}}
			/>

			<defs>
				<linearGradient id="linearGradient-income" x1="0" y1="0" x2="0" y2="1">
					<stop offset="2%" stop-color="#3d82f6" stop-opacity={0.8}></stop>
					<stop offset="98%" stop-color="#3d82f6" stop-opacity={0}></stop>
				</linearGradient>
			</defs>

			<Area
				y1={(d: ArrayElement<typeof data>) => d.income}
				fill="url(#linearGradient-income)"
				class="drop-shadow-sm"
				stroke="#3d82f6"
				strokeWidth={2}
				curve={curveCatmullRom}
			/>

			<defs>
				<linearGradient id="linearGradient-expense" x1="0" y1="0" x2="0" y2="1">
					<stop offset="2%" stop-color="#f43f5e" stop-opacity={0.8}></stop>
					<stop offset="98%" stop-color="#f43f5e" stop-opacity={0}></stop>
				</linearGradient>
			</defs>

			<Area
				y1={(d: ArrayElement<typeof data>) => d.expense}
				fill="url(#linearGradient-expense)"
				class="drop-shadow-sm"
				stroke="#f43f5e"
				strokeWidth={2}
				curve={curveCatmullRom}
			/>

			<Highlight y={(d: ArrayElement<typeof data>) => d.income} points={{ fill: '#3d82f6' }} />
			<Highlight y={(d: ArrayElement<typeof data>) => d.expense} points={{ fill: '#f43f5e' }} />
			<Highlight lines />
		</Svg>

		<Tooltip.Root
			let:data
			classes={{
				container: 'bg-card fill-card-foreground border rounded-sm overflow-hidden shadow-sm p-0'
			}}
		>
			<Tooltip.Header classes={{ root: 'bg-muted px-3 py-2 text-sm' }}
				>{format(data.date as Date, 'MMM dd, yyyy')}</Tooltip.Header
			>
			<Tooltip.List class="py-2 px-3 space-y-1">
				<!-- silly props https://github.com/techniq/layerchart/blob/main/packages/layerchart/src/lib/components/tooltip/TooltipItem.svelte -->
				<Tooltip.Item
					classes={{ color: 'bg-[#3d82f6]' }}
					class="flex items-center justify-between gap-x-4"
					label="income"
					value={data.income}
					format={formatCurrency}
					color="#3d82f6"
				/>

				<Tooltip.Item
					classes={{ color: 'bg-[#f43f5e]' }}
					class="flex items-center justify-between gap-x-4"
					label="expense"
					value={data.expense}
					format={formatCurrency}
					color="#f43f5e"
				/>
			</Tooltip.List>
		</Tooltip.Root>
	</Chart>
</div>
