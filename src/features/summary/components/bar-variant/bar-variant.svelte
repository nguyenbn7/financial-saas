<script lang="ts">
	import { onMount } from 'svelte';
	import { format } from 'date-fns';
	import { formatCurrency } from '$lib';
	import Chart from 'chart.js/auto';

	interface Props {
		data: {
			date: Date;
			income: number;
			expense: number;
		}[];
	}

	let { data }: Props = $props();

	let chartEl: HTMLCanvasElement;

	onMount(() => {
		new Chart(chartEl, {
			type: 'bar',
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback(tickValue, index, ticks) {
								return formatCurrency(tickValue as number);
							}
						}
					},
					x: {
						beginAtZero: true,
						ticks: {
							minRotation: 0,
							maxRotation: 0,
							callback(tickValue, index, ticks) {
								return format(data[index].date, 'dd, MMM');
							}
						}
					}
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							title(tooltipItems) {
								const { dataIndex } = tooltipItems[0];
								return format(data[dataIndex].date, 'MMM dd, yyyy');
							},
							label(tooltipItem) {
								const { dataset, formattedValue } = tooltipItem;
								return `${dataset.label}: ${formatCurrency(Number(formattedValue))}`;
							}
						}
					}
				}
			},
			data: {
				labels: data.map((d) => d.date),
				datasets: [
					{
						label: 'Income',
						data: data.map((d) => d.income),
						backgroundColor: '#3d82f6'
					},
					{
						label: 'Expense',
						data: data.map((d) => d.expense),
						backgroundColor: '#f43f5e'
					}
				]
			},
			plugins: [
				{
					id: 'hoverSegment',
					beforeDatasetsDraw(chart, args) {
						// TODO: https://www.youtube.com/watch?v=ec761hCLIpE
					}
				}
			]
		});
	});
</script>

<div class="h-[350px]">
	<canvas bind:this={chartEl}></canvas>
</div>
