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

	let accountsQuery = $state(useGetAccountOptions());
	const accountMutation = useCreateAccount();
	const succeedCreateNewAccount = $derived($accountMutation.isSuccess);
	const onCreateAccount = (name: string) => $accountMutation.mutate({ name });
	const accountOptions = $derived(
		($accountsQuery.data ?? []).map((account) => ({
			label: account.name,
			value: account.id.toString()
		}))
	);

	$effect(() => {
		if (succeedCreateNewAccount) {
			accountsQuery = useGetAccountOptions();
		}
	});

	let categoriesQuery = $state(useGetCategoryOptions());
	const categoryMutation = useCreateCategory();
	const succeedCreateNewCategory = $derived($categoryMutation.isSuccess);
	const onCreateCategory = (name: string) => $categoryMutation.mutate({ name });
	const categoryOptions = $derived(
		($categoriesQuery.data ?? []).map((category) => ({
			label: category.name,
			value: category.id.toString()
		}))
	);

	$effect(() => {
		if (succeedCreateNewCategory) {
			categoriesQuery = useGetCategoryOptions();
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
	<SheetContent class="space-y-4" interactOutsideBehavior={disabledInternal ? 'ignore' : 'close'}>
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
			{onCreateAccount}
			{accountOptions}
			{onCreateCategory}
			{categoryOptions}
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
