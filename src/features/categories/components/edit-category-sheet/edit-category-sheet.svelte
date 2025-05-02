<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import { useEditCategory } from '$features/categories/components/edit-category-sheet';
	import { categorySchema } from '$features/categories/schema';
	import { CategoryForm } from '$features/categories/components';
	import { useUpdateCategory, useGetCategory, useDeleteCategories } from '$features/categories/api';

	import { useConfirm } from '$lib/components/confirm-dialog';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	const { confirm } = useConfirm();

	const queryClient = useQueryClient();

	const { isOpen, categoryId, onClose } = useEditCategory();

	const getCategoryClient = useGetCategory();

	const updateCategoryClient = useUpdateCategory({
		async onSuccess(data, variables, context) {
			onClose();

			const { param } = variables;

			await queryClient.invalidateQueries({ queryKey: ['get', 'category', param.id] });
		}
	});

	const deleteCategoriesClient = useDeleteCategories({
		onSuccess: () => onClose()
	});

	const category = $derived($getCategoryClient.data?.category);

	const form = superForm(defaults(zod(categorySchema)), {
		id: 'edit category form',
		SPA: true,
		validators: zodClient(categorySchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid && category) {
				$updateCategoryClient.mutate({ param: { id: category.id }, json: validatedForm.data });
			}
		},
		resetForm: false
	});

	const { form: formData } = form;

	$effect(() => {
		if (category) formData.set({ ...category });
		else form.reset(defaults(zod(categorySchema)));
	});

	const disableLoader = $derived(
		$deleteCategoriesClient.isPending || $getCategoryClient.isFetching
	);

	const disabled = $derived($updateCategoryClient.isPending || disableLoader);
</script>

<Sheet open={$isOpen} onOpenChange={onClose}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$updateCategoryClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>Edit Category</SheetTitle>
			<SheetDescription>Edit an existing category.</SheetDescription>
		</SheetHeader>

		<CategoryForm id={$categoryId} {form} {disabled} {disableLoader} />

		<Button
			class="w-full"
			{disabled}
			variant="outline-red"
			onclick={async () => {
				const ok = await confirm({
					title: 'Are you sure?',
					description: 'You are about to delete this category'
				});

				if (ok && $categoryId) {
					$deleteCategoriesClient.mutate({ ids: [$categoryId] });
				}
			}}
		>
			{#if disabled && $deleteCategoriesClient.isPending}
				<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
				Deleting...
			{:else}
				<Trash size={16} class="mr-1" />Delete category
			{/if}
		</Button>
	</SheetContent>
</Sheet>
