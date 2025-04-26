<script lang="ts">
	import { onMount } from 'svelte';
	import { formatPercentage } from '$lib';
	import Chart from 'chart.js/auto';

	interface Props {
		data: {
			name: string;
			value: number;
		}[];
	}

	let { data }: Props = $props();

	let chartEl: HTMLCanvasElement;

	onMount(() => {
		new Chart(chartEl, {
			type: 'radar',
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							label(tooltipItem) {
								const { dataIndex } = tooltipItem;
								return `${data[dataIndex].name}: ${formatPercentage(data[dataIndex].value)}`;
							}
						}
					}
				}
			},
			data: {
				labels: data.map((d) => d.name),
				datasets: [
					{
						data: data.map((d) => d.value),
						backgroundColor: '#3b82f699',
						borderColor: '#3b82f6',
						borderWidth: 1
					}
				]
			}
		});
	});
</script>

<div class="h-[350px]">
	<canvas bind:this={chartEl}></canvas>
</div>
