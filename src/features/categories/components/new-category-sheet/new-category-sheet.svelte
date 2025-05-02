<script lang="ts">
	import { useNewCategory } from '$features/categories/components/new-category-sheet';
	import { categorySchema } from '$features/categories/schema';
	import { useCreateCategory } from '$features/categories/api';
	import { CategoryForm } from '$features/categories/components';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	const { isOpen, onClose } = useNewCategory();

	const createCategoryClient = useCreateCategory({
		onSuccess: () => onClose()
	});

	const form = superForm(defaults(zod(categorySchema)), {
		id: 'create category form',
		SPA: true,
		dataType: 'json',
		validators: zodClient(categorySchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid) {
				$createCategoryClient.mutate(validatedForm.data);
			}
		},
		resetForm: false
	});

	let disabled = $derived($createCategoryClient.isPending);

	$effect(() => {
		if (!$isOpen) form.reset();
	});
</script>

<Sheet open={$isOpen} onOpenChange={onClose}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$createCategoryClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>New Category</SheetTitle>
			<SheetDescription>Create a new category to organize your transactions.</SheetDescription>
		</SheetHeader>

		<CategoryForm {form} {disabled} />
	</SheetContent>
</Sheet>
