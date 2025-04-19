<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import type { accountFormSchema } from '$features/accounts/schema';

	import { z } from 'zod';

	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField, FormFieldErrors, FormLabel } from '$lib/components/ui/form';

	import { Form } from '$lib/components/form';

	interface Props {
		id?: string;
		form: SuperForm<z.infer<typeof accountFormSchema>, any>;
		disabled?: boolean;
		disableLoader?: boolean;
	}

	let { id, form, disabled = false, disableLoader = false }: Props = $props();

	const { form: formData } = form;

	const createForm = $derived(!Boolean(id));
</script>

<Form
	{form}
	class="space-y-4 mt-2"
	createButtonText="Create account"
	{disabled}
	{createForm}
	{disableLoader}
>
	{#snippet content({ disabled })}
		<FormField {form} name="name">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Name</FormLabel>

					<Input
						{...props}
						{disabled}
						placeholder="e.g. Cash, Bank, Credit Card"
						class="mt-2"
						bind:value={$formData.name}
					/>
				{/snippet}
			</FormControl>

			<FormFieldErrors />
		</FormField>
	{/snippet}
</Form>
