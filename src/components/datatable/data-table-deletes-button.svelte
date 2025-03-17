<script lang="ts" generics="TData, TForm extends Record<string, unknown>">
	import type { Row } from '@tanstack/table-core';
	import type { SuperForm } from 'sveltekit-superforms';

	import { Button } from '$components/ui/button';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$components/ui/alert-dialog';

	import { Trash2 } from '@lucide/svelte';

	interface Props {
		selectedRows: Row<TData>[];
		onUpdate: (selectedRows: Row<TData>[]) => void;
		form: SuperForm<TForm, any>;
		alertDialogDescription?: string;
	}

	let { selectedRows, onUpdate, form, alertDialogDescription }: Props = $props();
	const { enhance } = form;

	let isOpen = $state(false);

	$effect(() => onUpdate(selectedRows));
</script>

{#if selectedRows.length > 0}
	<Button
		variant="outline-red"
		class="ml-auto font-normal text-xs hover:cursor-pointer"
		onclick={() => (isOpen = true)}
	>
		<Trash2 /> Delete ({selectedRows.length})
	</Button>

	<AlertDialog bind:open={isOpen}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					{alertDialogDescription ||
						'This action cannot be undone. This will permanently delete selected data from servers.'}
				</AlertDialogDescription>
			</AlertDialogHeader>

			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<form action="?/deletes" method="post" use:enhance class="contents">
					<AlertDialogAction type="submit">Continue</AlertDialogAction>
				</form>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/if}
