<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { ConfirmDialog, getConfirmation } from '$lib/components/confirm-dialog';

	import { Trash2 } from '@lucide/svelte';

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

	let open = $state(false);

	async function onclick() {
		open = true;

		const ok = await getConfirmation();

		if (ok) return await onDeletes?.();
	}
</script>

<Button variant="outline-red" class="ml-auto font-normal hover:cursor-pointer" {onclick} {disabled}>
	<Trash2 /> Delete{!selectedRowsCount ? '' : ` (${selectedRowsCount})`}
</Button>

<ConfirmDialog bind:open title={confirmDialogTitle} description={confirmDialogDescription} />
