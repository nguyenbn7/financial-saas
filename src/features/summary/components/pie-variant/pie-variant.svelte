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

	const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];

	let chartEl: HTMLCanvasElement;

	onMount(() => {
		new Chart(chartEl, {
			type: 'doughnut',
			options: {
				responsive: true,
				maintainAspectRatio: false,
				cutout: '40%',
				radius: '90%',
				font: {
					size: 12
				},
				plugins: {
					legend: {
						align: 'start',
						position: 'bottom',
						labels: {
							usePointStyle: true,
							generateLabels(chart) {
								const labels =
									Chart.overrides['doughnut'].plugins.legend.labels.generateLabels(chart);

								return labels.map((label, idx) => {
									return {
										...label,
										text: `${label.text}: ${formatPercentage(data[idx].value)}`
									};
								});
							}
						}
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
						backgroundColor: COLORS,
						hoverOffset: 10
					}
				]
			}
		});
	});
</script>

<div class="h-[350px]">
	<canvas bind:this={chartEl}></canvas>
</div>
