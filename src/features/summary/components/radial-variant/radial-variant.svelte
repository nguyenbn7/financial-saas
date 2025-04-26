<script lang="ts">
	import { onMount } from 'svelte';
	import { formatPercentage } from '$lib';
	import Chart, {
		ArcElement,
		type BarOptions,
		type ChartDataset,
		type ChartOptions
	} from 'chart.js/auto';

	interface Props {
		data: {
			name: string;
			value: number;
		}[];
	}

	let { data }: Props = $props();

	const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];

	let chartEl: HTMLCanvasElement;

	const maxValue = $derived(Math.max(...data.map((d) => d.value)));

	onMount(() => {
		new Chart(chartEl, {
			type: 'doughnut',
			options: {
				cutout: '40%',
				radius: '90%',
				font: {
					size: 12
				},
				responsive: true,
				maintainAspectRatio: false,
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
										fillStyle: COLORS[idx % data.length],
										text: `${label.text}: ${data[idx].value}`
									};
								});
							}
						}
					}
				}
			} as ChartOptions<'doughnut'>,
			data: {
				labels: data.map((d) => d.name),
				datasets: data.map((d, idx) => ({
					label: d.name,
					data: [d.value],
					borderColor: 'white',
					borderWidth: 3,
					borderRadius: 10,
					hoverBorderColor: 'transparent',
					backgroundColor: COLORS[idx % data.length],
					// TODO: handle onclick label
					hoverOffset: 10,
					circumference: (d.value * 360) / maxValue
				})) as ChartDataset<'doughnut', number[]>[]
			},
			plugins: [
				{
					id: 'backgroundCircle',
					beforeDatasetsDraw(chart, args, pluginsOptions) {
						const { ctx, data, options } = chart;

						const datasetLength = data.datasets.length - 1;

						const { x, y, outerRadius } = chart.getDatasetMeta(0).data[0] as ArcElement;
						const { innerRadius } = chart.getDatasetMeta(datasetLength).data[0] as ArcElement;
						const angle = Math.PI / 180;

						ctx.save();
						ctx.translate(x, y);

						ctx.beginPath();
						ctx.fillStyle = '#61616b';
						ctx.arc(0, 0, outerRadius, 0, Math.PI * 2, false); // outer (filled)
						ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
						ctx.fill();

						for (let i = 0; i <= datasetLength; i++) {
							const { innerRadius: innerRadiusD } = chart.getDatasetMeta(i).data[0] as ArcElement;
							ctx.beginPath();
							ctx.lineWidth = ((options as BarOptions).borderWidth as number) ?? 0;
							ctx.strokeStyle = 'white';
							ctx.arc(0, 0, innerRadiusD, 0, angle * 360, false);
							ctx.stroke();
						}
						ctx.restore();
					}
				}
			]
		});
	});
</script>

<div class="h-[350px]">
	<canvas bind:this={chartEl}></canvas>
</div>
