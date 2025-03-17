<script lang="ts">
	import type { CategoryForms, UpdateCategoryForm } from './category-form.svelte';

	import { get } from 'svelte/store';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$components/ui/sheet';

	import CategoryForm from './category-form.svelte';

	interface Props {
		open?: boolean;
		form: CategoryForms;
		disabled?: boolean;
		onOpenChange?: (value: boolean) => void;
	}

	let { open = $bindable(false), form, disabled = false, onOpenChange }: Props = $props();

	function isUpdateForm(form: CategoryForms): form is UpdateCategoryForm {
		return get(form.form).id !== undefined;
	}
</script>

<Sheet bind:open {onOpenChange}>
	<SheetContent class="space-y-4" interactOutsideBehavior={disabled ? 'ignore' : 'close'}>
		<SheetHeader>
			<SheetTitle>{isUpdateForm(form) ? 'Edit ' : 'New '}Category</SheetTitle>
			<SheetDescription>
				{isUpdateForm(form)
					? 'Edit an existing category.'
					: 'Create a new category to organize your transactions.'}
			</SheetDescription>
		</SheetHeader>

		<CategoryForm {form} {disabled} />
	</SheetContent>
</Sheet>
