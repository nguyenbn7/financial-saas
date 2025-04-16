<script lang="ts" generics="TForm extends Record<string, unknown>, TFormMessage = unknown">
	import type { Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import { FormButton } from '$lib/components/ui/form';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		form: SuperForm<TForm, TFormMessage>;
		action?: string | undefined | null;
		disabled?: boolean;
		createButtonText?: string;
		updateButtonText?: string;
		createAction?: string;
		updateAction?: string;
		disableLoader?: boolean;
		class?: string;
		createForm?: boolean;
		content: Snippet<[{ disabled: boolean }]>;
	}

	let {
		form,
		class: className,
		createForm = false,
		createAction = '?/create',
		createButtonText = 'Create',
		updateAction = '?/update',
		updateButtonText = 'Update',
		disabled: _disabled = false,
		disableLoader = false,
		content
	}: Props = $props();

	const { enhance, delayed } = form;

	let disabled = $derived($delayed || _disabled);
</script>

<form
	method="post"
	action={createForm ? createAction : updateAction}
	class={cn('space-y-8 w-full', className)}
	use:enhance
>
	{@render content({ disabled })}

	<FormButton {disabled} class="w-full">
		{#if !disabled}
			{createForm ? createButtonText : updateButtonText}
		{:else if !disableLoader}
			{createForm ? 'Creating...' : 'Saving Changes...'}
			<LoaderCircle class="animate-spin ml-2" />
		{/if}
	</FormButton>
</form>
