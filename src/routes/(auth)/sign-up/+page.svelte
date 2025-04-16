<script lang="ts">
	import type { PageData } from './$types';

	import { SignUp } from 'svelte-clerk/client';
	import { Metadata } from '$lib/components/metadata';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();
</script>

<Metadata title="Create an account" />

<SignUp />
