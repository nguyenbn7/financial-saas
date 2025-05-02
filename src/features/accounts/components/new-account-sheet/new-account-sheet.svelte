<script lang="ts">
	import { useNewAccount } from '$features/accounts/components/new-account-sheet';
	import { accountSchema } from '$features/accounts/schema';
	import { useCreateAccount } from '$features/accounts/api';
	import { AccountForm } from '$features/accounts/components';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';

	const { isOpen, onClose } = useNewAccount();

	const createAccountClient = useCreateAccount({
		onSuccess: () => onClose()
	});

	const form = superForm(defaults(zod(accountSchema)), {
		id: 'create account form',
		SPA: true,
		dataType: 'json',
		validators: zodClient(accountSchema),
		onUpdate({ form: validatedForm }) {
			if (validatedForm.valid) {
				$createAccountClient.mutate(validatedForm.data);
			}
		},
		resetForm: false
	});

	let disabled = $derived($createAccountClient.isPending);

	$effect(() => {
		if (!$isOpen) form.reset();
	});
</script>

<Sheet open={$isOpen} onOpenChange={onClose}>
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
