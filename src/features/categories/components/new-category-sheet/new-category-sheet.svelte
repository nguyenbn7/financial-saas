<script lang="ts" module>
	let open = $state(false);

	export function openNewCategorySheet() {
		open = true;
	}

	export function closeNewCategorySheet() {
		open = false;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { useQueryClient } from '@tanstack/svelte-query';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { toast } from 'svelte-sonner';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	import { categoryFormSchema } from '$features/categories/schema';
	import { createCreateCategoryClient } from '$features/categories/api';
	import { CategoryForm } from '$features/categories/components';

	const queryClient = useQueryClient();

	const createCategoryClient = createCreateCategoryClient({
		onSuccess() {
			open = false;
			toast.success('Category created');

			queryClient.invalidateQueries({ queryKey: ['get', 'categories'] });
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

	const form = superForm(defaults(zod(categoryFormSchema)), {
		id: 'create category form',
		SPA: true,
		dataType: 'json',
		validators: zodClient(categoryFormSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid) {
				$createCategoryClient.mutate(validatedForm.data);
			}
		}
	});

	let disabled = $derived($createCategoryClient.isPending);
</script>

<Sheet
	bind:open
	onOpenChange={(value) => {
		if (!value) {
			form.reset();
		}
	}}
>
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
