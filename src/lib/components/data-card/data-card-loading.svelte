<script lang="ts">
	import { cn } from '$lib/utils';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<Card class={cn('border-none drop-shadow-sm h-[192px]', className)}>
	<CardHeader class="flex flex-row items-center justify-between gap-x-4">
		<div class="space-y-2">
			<Skeleton class="h-6 w-24" />
			<Skeleton class="h-4 w-40" />
		</div>
		<Skeleton class="size-12" />
	</CardHeader>
	<CardContent>
		<Skeleton class="shrink-0 h-10 w-24 mb-2" />
		<Skeleton class="shrink-0 h-4 w-40" />
	</CardContent>
</Card>
