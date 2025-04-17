<script lang="ts">
	import { cn } from '$lib/utils';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	interface Props {
		id: string;
		category: string | null;
		categoryId: string | null;
	}

	let { id, category, categoryId }: Props = $props();
</script>

<button
	class={cn('flex items-center cursor-pointer hover:underline', !category && 'text-rose-500')}
	onclick={() => {
		// TODO: open sheet
		console.log(categoryId);
	}}
>
	{#if category}
		{category}
	{:else}
		<TriangleAlert class="mr-2 size-4 shrink-0" />
		Uncategorized
	{/if}
</button>
