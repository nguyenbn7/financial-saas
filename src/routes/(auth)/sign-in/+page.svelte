<script lang="ts">
	import type { PageData } from './$types';

	import { SignIn } from 'svelte-clerk/client';
	import { Metadata } from '$lib/components/metadata';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();
</script>

<Metadata title="Sign in to your account" />

<SignIn />
