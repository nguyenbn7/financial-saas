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
		const ctx = chartEl.getContext('2d');

		const incomeGradient = ctx?.createLinearGradient(0, 0, 0, 350);
		incomeGradient?.addColorStop(0.2, '#3d82f6cc');
		incomeGradient?.addColorStop(0.98, '#3d82f600');

		const expenseGradient = ctx?.createLinearGradient(0, 0, 0, 350);
		expenseGradient?.addColorStop(0.2, '#f43f5ecc');
		expenseGradient?.addColorStop(0.98, '#f43f5e00');

		new Chart(chartEl, {
			type: 'line',
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
				},
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
								const { dataset, raw } = tooltipItem;
								return `${dataset.label}: ${formatCurrency(raw as number)}`;
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
						borderColor: '#3d82f6',
						backgroundColor: incomeGradient,
						fill: 'origin',
						tension: 0.3,
						pointRadius: 0,
						borderWidth: 2
					},
					{
						label: 'Expense',
						data: data.map((d) => d.expense),
						borderColor: '#f43f5e',
						backgroundColor: expenseGradient,
						fill: 'origin',
						tension: 0.3,
						pointRadius: 0,
						borderWidth: 2
					}
				]
			}
		});
	});
</script>

<div class="h-[350px]">
	<canvas bind:this={chartEl}></canvas>
</div>
