<script lang="ts">
	import type { PageData } from './$types';

	import { Metadata } from '$lib/components/metadata';
	
	import { SignIn } from 'svelte-clerk/client';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();
</script>

<Metadata title="Sign in to your account" />

<SignIn />
