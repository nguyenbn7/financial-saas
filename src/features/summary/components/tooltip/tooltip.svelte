<script lang="ts">
	import { format } from 'date-fns';
	import { Tooltip } from 'layerchart';
	import { formatCurrency } from '$lib';
</script>

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
			format={(d: number) => formatCurrency(d * -1)}
			color="#f43f5e"
		/>
	</Tooltip.List>
</Tooltip.Root>
