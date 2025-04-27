<script lang="ts">
	import { page } from '$app/state';
	import { formatDateRange } from '$lib';
	import { createGetSummaryClient } from '$features/summary/api';
	import { DataCard, DataCardLoading } from '$lib/components/data-card';
	import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from '$lib/components/icon';

	const from = $derived(page.url.searchParams.get('from') || undefined);
	const to = $derived(page.url.searchParams.get('to') || undefined);

	const dateRangeLabel = $derived(formatDateRange({ from, to }));

	const getSummaryClient = createGetSummaryClient();
</script>

{#if $getSummaryClient.isLoading}
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
		<DataCardLoading />
		<DataCardLoading />
		<DataCardLoading />
	</div>
{:else}
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
		<DataCard
			title="Remaining"
			value={$getSummaryClient.data?.remainingAmount}
			percentageChange={$getSummaryClient.data?.remainingChange}
			dateRange={dateRangeLabel}
		>
			{#snippet icon({ class: className })}
				<FaPiggyBank class={className} />
			{/snippet}
		</DataCard>

		<DataCard
			title="Income"
			value={$getSummaryClient.data?.incomeAmount}
			percentageChange={$getSummaryClient.data?.incomeChange}
			dateRange={dateRangeLabel}
		>
			{#snippet icon({ class: className })}
				<FaArrowTrendUp class={className} />
			{/snippet}
		</DataCard>

		<DataCard
			title="Expenses"
			value={$getSummaryClient.data?.expenseAmount}
			percentageChange={$getSummaryClient.data?.expenseChange}
			dateRange={dateRangeLabel}
		>
			{#snippet icon({ class: className })}
				<FaArrowTrendDown class={className} />
			{/snippet}
		</DataCard>
	</div>
{/if}
