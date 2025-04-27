<script lang="ts">
	import { createGetSummaryClient } from '$features/summary/api';
	import { Chart } from '$features/summary/components/chart';
	import { SpendingPie } from '$features/summary/components/spending-pie';
	import { DataCardLoading } from '$lib/components/data-card';

	const getSummaryClient = createGetSummaryClient();
</script>

<div class="grid grid-cols-1 lg:grid-cols-6 gap-8">
	{#if $getSummaryClient.isLoading}
		<div class="col-span-1 lg:col-span-3 xl:col-span-4">
			<DataCardLoading class="h-[350px]" />
		</div>
		<div class="col-span-1 lg:col-span-3 xl:col-span-2">
			<DataCardLoading class="h-[350px]" />
		</div>
	{:else}
		<div class="col-span-1 lg:col-span-3 xl:col-span-4">
			<Chart data={$getSummaryClient.data?.days} />
		</div>
		<div class="col-span-1 lg:col-span-3 xl:col-span-2">
			<SpendingPie data={$getSummaryClient.data?.categories} />
		</div>
	{/if}
</div>
