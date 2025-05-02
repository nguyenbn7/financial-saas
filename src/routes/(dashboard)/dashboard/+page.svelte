<script lang="ts">
	import type { PageProps } from './$types';

	import { DataGrid } from '$features/summary/components/data-grid';
	import { DataCharts } from '$features/summary/components/data-charts';

	import { Metadata } from '$lib/components/metadata';

	let { data }: PageProps = $props();
</script>

<Metadata title="Dashboard" />

<div class="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
	<DataGrid />
	<DataCharts />
</div>
