<script lang="ts">
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	import { useEditTransaction } from '$features/transactions/components/edit-transaction-sheet';

	import { useEditCategory } from '$features/categories/components/edit-category-sheet';

	import { cn } from '$lib/utils';

	interface Props {
		id: string;
		category: string | null;
		categoryId: string | null;
	}

	let { id, category, categoryId }: Props = $props();

	const { onOpen: openEditCategorySheet } = useEditCategory();
	const { onOpen: openEditTransactionSheet } = useEditTransaction();
</script>

<button
	class={cn('flex items-center cursor-pointer hover:underline', !category && 'text-rose-500')}
	onclick={() => {
		if (categoryId) openEditCategorySheet(categoryId);
		else openEditTransactionSheet(id);
	}}
>
	{#if category}
		{category}
	{:else}
		<TriangleAlert class="mr-2 size-4 shrink-0" />
		Uncategorized
	{/if}
</button>
