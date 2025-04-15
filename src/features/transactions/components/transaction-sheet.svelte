<script lang="ts">
	import type { TransactionFormValues } from '.';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	import { confirm } from '$lib/components/confirm-dialog';

	import { TransactionForm } from '.';

	import { useCreateAccount, useGetAccountOptions } from '$features/accounts/api';
	import { useCreateCategory, useGetCategoryOptions } from '$features/categories/api';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Trash from '@lucide/svelte/icons/trash';

	interface Props {
		form: TransactionFormValues;
		open?: boolean;
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
			description: 'You are about to delete this account'
		});

		if (ok) {
			return await onDelete?.($formData.id!);
		}
	}

	const accountsQuery = useGetAccountOptions();
	const accountMutation = useCreateAccount({
		onSuccess() {
			$accountsQuery.refetch();
		}
	});

	const categoriesQuery = useGetCategoryOptions();
	const categoryMutation = useCreateCategory({
		onSuccess() {
			$categoriesQuery.refetch();
		}
	});

	let disabledInternal = $derived(
		disabled ||
			$accountsQuery.isFetching ||
			$accountMutation.isPending ||
			$categoriesQuery.isFetching ||
			$categoryMutation.isPending
	);
</script>

<Sheet bind:open {onOpenChange}>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={disabledInternal ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>New Transaction</SheetTitle>
			<SheetDescription>Create a new transaction.</SheetDescription>
		</SheetHeader>

		<TransactionForm
			{form}
			disabled={disabledInternal}
			{createAction}
			{updateAction}
			showLoader={!deleting}
			accountOptions={($accountsQuery.data ?? []).map((account) => ({
				label: account.name,
				value: account.id.toString()
			}))}
			onCreateAccount={(name) => $accountMutation.mutate({ name })}
			categoryOptions={($categoriesQuery.data ?? []).map((category) => ({
				label: category.name,
				value: category.id.toString()
			}))}
			onCreateCategory={(name) => $categoryMutation.mutate({ name })}
		/>

		{#if $formData.id}
			<Button class="w-full" disabled={disabledInternal} variant="outline-red" onclick={onClick}>
				{#if disabled && deleting}
					<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
					Deleting...
				{:else}
					<Trash size={16} class="mr-1" />Delete transaction
				{/if}
			</Button>
		{/if}
	</SheetContent>
</Sheet>
