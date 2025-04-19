<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import { buttonVariants } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	import { cn } from '$lib/utils';

	import Edit from '@lucide/svelte/icons/edit';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	interface Props {
		onEdit?: MouseEventHandler<HTMLDivElement> | null | undefined;
		onDelete?: MouseEventHandler<HTMLDivElement> | null | undefined;
	}

	let { onEdit, onDelete }: Props = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-8 p-0')}>
		<MoreHorizontal />
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end">
		<DropdownMenuItem class="cursor-pointer" onclick={onEdit}>
			<Edit /> Edit
		</DropdownMenuItem>
		<DropdownMenuItem class="cursor-pointer" onclick={onDelete}>
			<Trash2 /> Delete
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
