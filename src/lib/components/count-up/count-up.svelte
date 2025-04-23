<script lang="ts">
	import { onMount } from 'svelte';
	import * as countup from 'countup.js';

	const { CountUp } = countup;

	interface Props {
		preserveValue?: boolean;
		start?: number;
		end: number;
		decimalPlaces?: number;
		formattingFn?: (n: number) => string;
	}

	let { preserveValue, start = 0, end, decimalPlaces, formattingFn }: Props = $props();

	let targetEl: HTMLElement;
	let countUpAnim: countup.CountUp;

	onMount(() => {
		countUpAnim = new CountUp(targetEl, end, {
			startVal: start,
			decimalPlaces,
			formattingFn,
		});
	});

	$effect(() => {
    if(!preserveValue) countUpAnim.reset();
    if(end) countUpAnim.update(end);
  })
</script>

<span bind:this={targetEl}>{formattingFn?.(start) ?? `${start}`}</span>
