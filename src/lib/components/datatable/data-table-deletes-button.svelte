<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { confirm } from '$lib/components/confirm-dialog';

	import Trash2 from '@lucide/svelte/icons/trash-2';

	interface Props {
		selectedRowsCount?: number;
		confirmDialogTitle?: string;
		confirmDialogDescription?: string;
		onDeletes?: () => MaybePromise<void>;
		disabled?: boolean;
	}

	let {
		selectedRowsCount = 0,
		confirmDialogTitle,
		confirmDialogDescription,
		onDeletes,
		disabled
	}: Props = $props();

	async function onclick() {
		const ok = await confirm({
			title: confirmDialogTitle,
			description: confirmDialogDescription
		});

		if (ok) return await onDeletes?.();
	}
</script>

<Button variant="outline-red" class="ml-auto font-normal hover:cursor-pointer" {onclick} {disabled}>
	<Trash2 /> Delete{!selectedRowsCount ? '' : ` (${selectedRowsCount})`}
</Button>
