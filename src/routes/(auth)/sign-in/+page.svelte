<script lang="ts">
	import type { PageProps } from './$types';

	import { applyAction } from '$app/forms';

	import { toast } from 'svelte-sonner';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Checkbox } from '$components/ui/checkbox';
	import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$components/ui/form';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { LoaderCircle } from '@lucide/svelte';
	import Metadata from '$components/metadata.svelte';
	import ShowPasswordButton from '$components/show-password-button.svelte';
	import { signInSchema } from '$features/auth/auth.schemas';

	let { data }: PageProps = $props();

	let showPassword = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(signInSchema),
		onUpdated({ form }) {
			if (!form.valid) {
				toast.error(form.message);
			}
		},
		onResult: async ({ result }) => {
			if (result.type === 'redirect') {
				await applyAction(result);
				toast.success('We are glad you are back');
				return;
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Metadata title="Sign in to your account" />

<Card>
	<CardHeader>
		<CardTitle class="text-center text-2xl font-bold">Sign in to your account</CardTitle>
	</CardHeader>

	<CardContent>
		<form method="POST" class="space-y-4 md:space-y-6" use:enhance>
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

			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center text-sm">
					<Checkbox id="remember-me" disabled={$delayed} />
					<Label for="remember-me" class="ml-3 font-normal">Remember me</Label>
				</div>
				<div class="text-sm">
					<a href={'#'} class="text-primary hover:underline font-semibold">
						Forgot your password?
					</a>
				</div>
			</div>

			<div class="mt-8">
				<FormButton class="w-full rounded-lg" disabled={$delayed}
					>Sign in
					{#if $delayed}
						<LoaderCircle size={16} class="ml-1 text-primary-foreground animate-spin" />
					{/if}
				</FormButton>
			</div>

			<p class="text-gray-800 dark:text-white text-sm mt-8 text-center">
				Don't have an account? <a
					href="/sign-up"
					class="text-primary hover:underline ml-1 whitespace-nowrap font-semibold">Register here</a
				>
			</p>
		</form>
	</CardContent>
</Card>
