<script lang="ts">
	import type { AccountForms, UpdateAccountForm } from './account-form.svelte';

	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$components/ui/sheet';

	import AccountForm from './account-form.svelte';
	import { get } from 'svelte/store';

	interface Props {
		open?: boolean;
		form: AccountForms;
		disabled?: boolean;
		onOpenChange?: (value: boolean) => void;
	}

	let { open = $bindable(false), form, disabled = false, onOpenChange }: Props = $props();

	function isEditForm(form: AccountForms): form is UpdateAccountForm {
		return get(form.form).id !== undefined;
	}
</script>

<Sheet bind:open {onOpenChange}>
	<SheetContent class="space-y-4" interactOutsideBehavior={disabled ? 'ignore' : 'close'}>
		<SheetHeader>
			<SheetTitle>{isEditForm(form) ? 'Edit ' : 'New '}Account</SheetTitle>
			<SheetDescription>
				{isEditForm(form)
					? 'Edit an existing account.'
					: 'Create a new account to track your transactions.'}
			</SheetDescription>
		</SheetHeader>

		<AccountForm {form} {disabled} />
	</SheetContent>
</Sheet>
