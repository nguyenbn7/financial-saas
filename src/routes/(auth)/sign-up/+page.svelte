<script lang="ts">
	import type { PageProps } from './$types';

	import { PUBLIC_APP_NAME } from '$env/static/public';

	import { applyAction } from '$app/forms';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { Checkbox } from '$components/ui/checkbox';
	import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$components/ui/form';
	import { toast } from 'svelte-sonner';

	import { Loader } from '@lucide/svelte';
	import Metadata from '$components/metadata.svelte';
	import ShowPasswordButton from '$components/show-password-button.svelte';
	import { signUpSchema } from '$features/auth/auth.schemas';

	let { data }: PageProps = $props();

	let showPassword = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(signUpSchema),
		onUpdated({ form }) {
			if (!form.valid) {
				toast.error(form.message);
			}
		},
		onResult: async ({ result }) => {
			if (result.type === 'redirect') {
				await applyAction(result);
				toast.success(`Welcome to ${PUBLIC_APP_NAME}`);
				return;
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Metadata title="Create an account" />

<Card>
	<CardHeader>
		<CardTitle class="text-center text-2xl font-bold">Create an account</CardTitle>
	</CardHeader>

	<CardContent>
		<form method="POST" class="space-y-4 md:space-y-6" use:enhance>
			<FormField {form} name="name">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel class="text-gray-800 dark:text-white text-sm mb-2 block">Your name</FormLabel
						>
						<Input
							{...props}
							bind:value={$formData.name}
							type="text"
							required
							placeholder="Enter your name"
							autocomplete="off"
							disabled={$delayed}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>

			<FormField {form} name="email">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel class="text-gray-800 dark:text-white text-sm mb-2 block"
							>Your email</FormLabel
						>
						<Input
							{...props}
							bind:value={$formData.email}
							type="email"
							required
							placeholder="Enter email address"
							autocomplete="email"
							disabled={$delayed}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>

			<FormField {form} name="password">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel class="text-gray-800 dark:text-white text-sm mb-2 block">Password</FormLabel>
						<div class="relative flex items-center">
							<Input
								{...props}
								bind:value={$formData.password}
								type={showPassword ? 'text' : 'password'}
								required
								placeholder="Enter password"
								autocomplete="current-password"
								disabled={$delayed}
							/>
							<ShowPasswordButton bind:show={showPassword} />
						</div>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>

			<div class="flex items-center">
				<Checkbox id="terms" disabled={$delayed} />
				<Label for="terms" class="ml-3 font-normal text-sm"
					>I accept the <a href={'#'} class="text-primary font-semibold hover:underline ml-1"
						>Terms and Conditions</a
					></Label
				>
			</div>

			<div class="mt-8">
				<FormButton class="w-full rounded-lg" disabled={$delayed}
					>Create an account
					{#if $delayed}
						<Loader size={16} class="ml-1 text-primary-foreground animate-spin" />
					{/if}
				</FormButton>
			</div>

			<p class="text-gray-800 dark:text-white text-sm mt-8 text-center">
				Already have an account? <a
					href="/sign-in"
					class="text-primary hover:underline ml-1 whitespace-nowrap font-semibold">Login here</a
				>
			</p>
		</form>
	</CardContent>
</Card>
