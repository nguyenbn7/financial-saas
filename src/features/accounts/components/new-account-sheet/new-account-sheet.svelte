<script lang="ts" module>
	let open = $state(false);

	export function openNewAccountSheet() {
		open = true;
	}

	export function closeNewAccountSheet() {
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

	import { accountFormSchema } from '$features/accounts/schema';
	import { createCreateAccountClient } from '$features/accounts/api';
	import { AccountForm } from '$features/accounts/components';

	const queryClient = useQueryClient();

	const createAccountClient = createCreateAccountClient({
		onSuccess() {
			open = false;

			toast.success('Account created');

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

	const form = superForm(defaults(zod(accountFormSchema)), {
		id: 'create account form',
		SPA: true,
		dataType: 'json',
		validators: zodClient(accountFormSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid) {
				$createAccountClient.mutate(validatedForm.data);
			}
		}
	});

	let disabled = $derived($createAccountClient.isPending);
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
		interactOutsideBehavior={$createAccountClient.isPending ? 'ignore' : 'close'}
	>
		<SheetHeader>
			<SheetTitle>New Account</SheetTitle>
			<SheetDescription>Create a new account to track your transactions.</SheetDescription>
		</SheetHeader>

		<AccountForm {form} {disabled} />
	</SheetContent>
</Sheet>
