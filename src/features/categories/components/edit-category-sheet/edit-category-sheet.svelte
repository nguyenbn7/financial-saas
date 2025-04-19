<script lang="ts" module>
	let open = $state(false);
	let id: string | undefined = $state();

	export function openEditCategorySheet(categoryId: string) {
		id = categoryId;
		open = true;
	}

	export function closeEditCategorySheet() {
		open = false;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	import { confirm } from '$lib/components/confirm-dialog';

	import { categoryFormSchema } from '$features/categories/schema';
	import { CategoryForm } from '$features/categories/components';
	import {
		createUpdateCategoryClient,
		createGetCategoryClient,
		createDeleteCategoriesClient
	} from '$features/categories/api';

	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const queryClient = useQueryClient();

	let getCategoryClient = $derived(id ? createGetCategoryClient({ id }) : undefined);
	let category = $derived($getCategoryClient?.data?.category ?? undefined);

	const updateCategoryClient = createUpdateCategoryClient({
		async onSuccess() {
			open = false;
			toast.success('Category updated');

			if (id) {
				await queryClient.invalidateQueries({ queryKey: ['get', 'category', id] });
				id = undefined;
			}
			queryClient.invalidateQueries({ queryKey: ['get', 'categories'] });
			await queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });
		},
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				open = false;
				return goto('/sign-in', { invalidateAll: true });
			}
		}
	});

	const deleteCategoriesClient = createDeleteCategoriesClient({
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				return goto('/sign-in', { invalidateAll: true });
			}
		},
		async onSuccess() {
			open = false;
			toast.success('Category deleted');

			if (id) {
				await queryClient.invalidateQueries({ queryKey: ['get', 'category', id] });
				id = undefined;
			}
			queryClient.invalidateQueries({ queryKey: ['get', 'categories'] });
			await queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });
		}
	});

	const form = superForm(defaults(zod(categoryFormSchema)), {
		id: 'edit category form',
		SPA: true,
		validators: zodClient(categoryFormSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid && category) {
				$updateCategoryClient.mutate({ param: { id: category.id }, json: validatedForm.data });
			}
		}
	});

	const { form: formData } = form;

	$effect(() => {
		if (category) formData.set({ ...category });
	});

	let disabled = $derived(
		$updateCategoryClient.isPending ||
			$getCategoryClient?.isFetching ||
			$deleteCategoriesClient.isPending
	);
</script>

<Sheet
	bind:open
	onOpenChange={(value) => {
		if (id) {
			queryClient.invalidateQueries({ queryKey: ['get', 'category', id] });
			id = undefined;
		}

		form.reset(defaults(zod(categoryFormSchema)));
	}}
>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$updateCategoryClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>Edit Category</SheetTitle>
			<SheetDescription>Edit an existing category.</SheetDescription>
		</SheetHeader>

		<CategoryForm {id} {form} {disabled} disableLoader={$deleteCategoriesClient.isPending} />

		<Button
			class="w-full"
			{disabled}
			variant="outline-red"
			onclick={async () => {
				const ok = await confirm({
					title: 'Are you sure?',
					description: 'You are about to delete this category'
				});

				if (ok && id) {
					$deleteCategoriesClient.mutate({ ids: [id] });
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
