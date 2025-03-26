<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		loading?: boolean;
		children: Snippet;
	}

	let { loading, children }: Props = $props();
</script>

{#if loading}
	<div class="px-4 lg:px-14 pb-10 -mt-24">
		<Card class="border-none drop-shadow-sm">
			<CardHeader>
				<Skeleton class="h-8 w-52" />
			</CardHeader>

			<CardContent>
				<div class="h-[500px] w-full flex items-center justify-center">
					<LoaderCircle size={40} class="text-primary animate-spin" />
				</div>
			</CardContent>
		</Card>
	</div>
{:else}
	{@render children()}
{/if}
