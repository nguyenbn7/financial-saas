<script lang="ts">
	import type { TransactionForms } from './transaction-form.svelte';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$components/ui/sheet';

	import { useGetAccountOptions } from '$features/accounts/api/use-get-account-options';

	import TransactionForm from './transaction-form.svelte';

	interface Props {
		open?: boolean;
		disabled?: boolean;
		form: TransactionForms;
	}

	let { open = $bindable(false), form, disabled = false }: Props = $props();

	const { form: formData } = form;

	let accountQuery = $derived.by(() => {
		return open ? useGetAccountOptions() : undefined;
	});

	let loading = $derived.by(() => $accountQuery?.isLoading || disabled);
	let accountOptions = $derived.by(() => $accountQuery?.data ?? []);
</script>

<Sheet
	bind:open
	onOpenChange={() => {
		form.reset();
	}}
>
	<SheetContent class="space-y-4" interactOutsideBehavior={disabled ? 'ignore' : 'close'}>
		<SheetHeader>
			<SheetTitle>New Transaction</SheetTitle>
			<SheetDescription>Create a new account to track your transactions.</SheetDescription>
		</SheetHeader>

		<TransactionForm {form} {accountOptions} disabled={loading} />
	</SheetContent>
</Sheet>
