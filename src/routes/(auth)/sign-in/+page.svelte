<script lang="ts">
	import type { PageData } from './$types';
	import type { EmailCodeFactor } from '@clerk/types';

	import Loader from '@lucide/svelte/icons/loader-circle';

	import {
		PUBLIC_DEMO_ACCOUNT_EMAIL,
		PUBLIC_DEMO_ACCOUNT_CODE,
		PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL
	} from '$env/static/public';

	import { Metadata } from '$lib/components/metadata';

	import { Button } from '$lib/components/ui/button';

	import { dark } from '@clerk/themes';
	import { mode } from 'mode-watcher';

	import { SignIn } from 'svelte-clerk/client';

	import { useClerkContext } from 'svelte-clerk/client';
	import { page } from '$app/state';

	interface PageProps {
		data: PageData;
	}

	const { data }: PageProps = $props();

	const ctx = useClerkContext();

	const signIn = $derived(ctx.client?.signIn);

	const clerk = $derived(ctx.clerk);

	const userId = $derived(ctx.auth.userId);

	let disabledSignInAsDemoUser = $state(false);

	async function signInAsDemoUser() {
		if (!signIn) return;

		disabledSignInAsDemoUser = true;

		const signInResp = await signIn.create({ identifier: PUBLIC_DEMO_ACCOUNT_EMAIL });

		if (!signInResp.supportedFirstFactors) {
			disabledSignInAsDemoUser = false;
			return;
		}

		const { emailAddressId } = signInResp.supportedFirstFactors.find(
			(ff) => ff.strategy === 'email_code' && ff.safeIdentifier === PUBLIC_DEMO_ACCOUNT_EMAIL
		)! as EmailCodeFactor;

		await signIn.prepareFirstFactor({
			strategy: 'email_code',
			emailAddressId: emailAddressId
		});

		const attemptResponse = await signIn.attemptFirstFactor({
			strategy: 'email_code',
			code: PUBLIC_DEMO_ACCOUNT_CODE
		});

		if (attemptResponse.status === 'complete') {
			await clerk?.setActive({ session: signIn.createdSessionId });

			window.location.href = PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL;
			return;
		}

		disabledSignInAsDemoUser = false;
	}
</script>

<Metadata title="Sign in to your account" />

<div class="flex flex-col">
	<SignIn appearance={{ baseTheme: mode.current === 'dark' ? dark : undefined }} />

	{#if !userId}
		<Button
			variant="link"
			class="mt-3 hover:cursor-pointer"
			onclick={signInAsDemoUser}
			disabled={disabledSignInAsDemoUser}
			hidden={!!page.url.hash}
			>Sign in as Demo User {#if disabledSignInAsDemoUser}
				<Loader size={16} class="animate-spin" />
			{/if}</Button
		>
	{/if}
</div>
