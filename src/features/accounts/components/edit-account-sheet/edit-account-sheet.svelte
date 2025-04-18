<script lang="ts" module>
	let open = $state(false);
	let id: string | undefined = $state();

	export function openEditAccountSheet(accountId: string) {
		id = accountId;
		open = true;
	}

	export function closeEditAccountSheet() {
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

	import { accountFormSchema } from '$features/accounts/schema';
	import { AccountForm } from '$features/accounts/components';
	import {
		createUpdateAccountsClient,
		createGetAccountClient,
		createDeleteAccountsClient
	} from '$features/accounts/api';

	import Trash from '@lucide/svelte/icons/trash';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const queryClient = useQueryClient();

	let getAccountClient = $derived(id ? createGetAccountClient({ id }) : undefined);
	let account = $derived($getAccountClient?.data?.account ?? undefined);

	const updateAccountClient = createUpdateAccountsClient({
		onSuccess() {
			open = false;
			toast.success('Account updated');
			queryClient.invalidateQueries({ queryKey: ['get', 'accounts'] });
		},
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				open = false;

				queryClient.invalidateQueries({ queryKey: ['get', 'accounts'], type: 'inactive' });

				return goto('/sign-in', { invalidateAll: true });
			}
		}
	});

	const deleteAccountsClient = createDeleteAccountsClient({
		async onError(error, variables, context) {
			const { message, status } = error;

			toast.error(message);

			if (status === 401) {
				queryClient.invalidateQueries({ queryKey: ['get', 'accounts'], type: 'inactive' });

				return goto('/sign-in', { invalidateAll: true });
			}
		},
		onSuccess() {
			open = false;

			toast.success('Account deleted');

			queryClient.invalidateQueries({ queryKey: ['get', 'accounts'] });
		}
	});

	const form = superForm(defaults(zod(accountFormSchema)), {
		id: 'edit account form',
		SPA: true,
		validators: zodClient(accountFormSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid && account) {
				$updateAccountClient.mutate({ param: { id: account.id }, json: validatedForm.data });
			}
		}
	});

	const { form: formData } = form;

	$effect(() => {
		if (account) formData.set({ ...account });
	});

	let disabled = $derived(
		$updateAccountClient.isPending ||
			$getAccountClient?.isFetching ||
			$deleteAccountsClient.isPending
	);
</script>

<Sheet
	bind:open
	onOpenChange={(value) => {
		if (!value) {
			if (id) {
				queryClient.invalidateQueries({ queryKey: ['get', 'account', id], type: 'inactive' });
				id = undefined;
			}
			form.reset();
		}
	}}
>
	<SheetContent
		class="space-y-4 overflow-y-auto"
		interactOutsideBehavior={$updateAccountClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>Edit Account</SheetTitle>
			<SheetDescription>Edit an existing account.</SheetDescription>
		</SheetHeader>

		<AccountForm {id} {form} {disabled} disableLoader={$deleteAccountsClient.isPending} />

		<Button
			class="w-full"
			{disabled}
			variant="outline-red"
			onclick={async () => {
				const ok = await confirm({
					title: 'Are you sure?',
					description: 'You are about to delete this account'
				});

				if (ok && id) {
					$deleteAccountsClient.mutate({ ids: [id] });
				}
			}}
		>
			{#if disabled && $deleteAccountsClient.isPending}
				<LoaderCircle size={16} class="mr-1 text-red-600 animate-spin" />
				Deleting...
			{:else}
				<Trash size={16} class="mr-1" />Delete account
			{/if}
		</Button>
	</SheetContent>
</Sheet>
