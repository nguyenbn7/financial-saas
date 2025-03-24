<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import { Button } from '$lib/components/ui/button';

	let scrollY = $state(0);
	let showAtPx = 100;

	const tween = new Tween(0, {
		delay: 0,
		easing: expoInOut
	});

	$effect(() => window.scrollTo(0, tween.current));

	async function scrollToTop() {
		await tween.set(scrollY, { duration: 0 });
		await tween.set(0, { duration: 1000 });
	}
</script>

<svelte:window bind:scrollY />

{#if scrollY > showAtPx}
	<div class="fixed bottom-4 right-4 z-996" transition:fade={{ duration: 700 }}>
		<Button
			class="leading-0 flex animate-bounce items-center justify-center rounded-[50%] hover:text-primary-foreground hover:bg-primary border-primary [&_svg]:size-5 text-primary hover:cursor-pointer"
			variant="outline"
			size="icon"
			onclick={() => scrollToTop()}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				><path d="m6.293 11.293 1.414 1.414L12 8.414l4.293 4.293 1.414-1.414L12 5.586z"></path><path
					d="m6.293 16.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L12 10.586z"
				></path></svg
			>
		</Button>
	</div>
{/if}
