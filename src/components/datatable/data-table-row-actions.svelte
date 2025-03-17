<script lang="ts">
	import { buttonVariants } from '$components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$components/ui/dropdown-menu';

	import { cn } from '$lib/utils';

	import { Edit, MoreHorizontal } from '@lucide/svelte';

	let { onEdit }: { onEdit?: () => MaybePromise<void> } = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-8 p-0')}>
		<MoreHorizontal />
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end">
		<DropdownMenuItem class="cursor-pointer" onclick={onEdit}><Edit /> Edit</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
