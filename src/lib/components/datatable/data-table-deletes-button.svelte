<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	interface Props {
		selectedRowsCount?: number;
		onDeletes?:
			| (MouseEventHandler<HTMLButtonElement> & MouseEventHandler<HTMLAnchorElement>)
			| null;
		disabled?: boolean;
	}

	let { selectedRowsCount = 0, onDeletes, disabled }: Props = $props();
</script>

<Button
	variant="outline-red"
	class="ml-auto font-normal hover:cursor-pointer"
	onclick={onDeletes}
	{disabled}
>
	<Trash2 /> Delete{!selectedRowsCount ? '' : ` (${selectedRowsCount})`}
</Button>
