<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		title: string;
		description: string;
		open?: boolean;
		disabled?: boolean;
		showDeleteButton?: boolean;
		showDeleteButtonLoader?: boolean;
		onDelete?: (MouseEventHandler<HTMLButtonElement> & MouseEventHandler<HTMLAnchorElement>) | null;
		content: Snippet;
		onOpenChange?: (value: boolean) => void;
	}

	let {
		title,
		description,
		open = $bindable(false),
		disabled = false,
		onDelete,
		onOpenChange,
		showDeleteButton = false,
		showDeleteButtonLoader = false,
		content
	}: Props = $props();
</script>

<Sheet bind:open {onOpenChange}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={disabled ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>{title}</SheetTitle>
			<SheetDescription>{description}</SheetDescription>
		</SheetHeader>

		{@render content()}

		{#if showDeleteButton}
			<Button class="w-full" {disabled} variant="outline-red" onclick={onDelete}>
				{#if disabled && showDeleteButtonLoader}
					<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
					Deleting...
				{:else}
					<Trash size={16} class="mr-1" />Delete account
				{/if}
			</Button>
		{/if}
	</SheetContent>
</Sheet>
