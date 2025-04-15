<script lang="ts">
	import type { CategoryFormValues } from '.';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	import { confirm } from '$lib/components/confirm-dialog';

	import { CategoryForm } from '.';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Trash from '@lucide/svelte/icons/trash';

	interface Props {
		open?: boolean;
		form: CategoryFormValues;
		createAction?: string;
		updateAction?: string;
		onOpenChange?: (value: boolean) => void;
		onDelete?: (id: number) => MaybePromise<void>;
		disabled?: boolean;
		deleting?: boolean;
	}

	let {
		form,
		onOpenChange,
		onDelete,
		open = $bindable(false),
		createAction = '?/create',
		updateAction = '?/update',
		disabled = false,
		deleting = false
	}: Props = $props();

	const { form: formData } = form;

	async function onClick() {
		const ok = await confirm({
			title: 'Are you sure?',
			description: 'You are about to delete this category'
		});

		if (ok) {
			return await onDelete?.($formData.id!);
		}
	}
</script>

<Sheet
	bind:open
	onOpenChange={(value) => {
		form.reset();
		onOpenChange?.(value);
	}}
>
	<SheetContent class="space-y-4" interactOutsideBehavior={disabled ? 'ignore' : 'close'}>
		<SheetHeader>
			<SheetTitle>{$formData.id ? 'Edit ' : 'New '}Category</SheetTitle>
			<SheetDescription>
				{$formData.id
					? 'Edit an existing category.'
					: 'Create a new category to organize your transactions.'}
			</SheetDescription>
		</SheetHeader>

		<CategoryForm {form} {disabled} {createAction} {updateAction} showLoader={!deleting} />

		{#if $formData.id}
			<Button class="w-full" {disabled} variant="outline-red" onclick={onClick}>
				{#if disabled && deleting}
					<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
					Deleting...
				{:else}
					<Trash size={16} class="mr-1" />Delete account
				{/if}
			</Button>
		{/if}
	</SheetContent>
</Sheet>
