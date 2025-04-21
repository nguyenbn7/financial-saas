<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';

	import { CreatableSelect } from '$lib/components/select';

	import { createCreateAccountClient, createGetAccountsClient } from '$features/accounts/api';

	import { selectedValue, useSelectAccount } from '$features/transactions/hooks/use-select-account';

	const { promise, handleConfirm, handleCancel } = useSelectAccount();

	const accountQuery = createGetAccountsClient();
	const accountMutation = createCreateAccountClient();

	const accountOptions = $derived(
		($accountQuery.data.accounts ?? []).map((account) => ({
			label: account.name,
			value: account.id
		}))
	);

	const onCreateAccount = (name: string) => {
		$accountMutation.mutate({ name });
	};
</script>

<AlertDialog open={$promise !== null}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Select Account</AlertDialogTitle>
			<AlertDialogDescription>Please select an account to continue.</AlertDialogDescription>
		</AlertDialogHeader>

		<CreatableSelect
			placeholder="Select an account"
			options={accountOptions}
			onCreate={onCreateAccount}
			onValueChange={(value) => selectedValue.set(value)}
			disabled={$accountQuery.isFetching || $accountMutation.isPending}
		/>

		<AlertDialogFooter>
			<AlertDialogCancel onclick={handleCancel}>Cancel</AlertDialogCancel>
			<AlertDialogAction onclick={handleConfirm}>Continue</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
