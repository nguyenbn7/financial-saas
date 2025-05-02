<script lang="ts">
	import type { PageData } from './$types';

	import { Metadata } from '$lib/components/metadata';

	import { SignUp } from 'svelte-clerk/client';

	interface PageProps {
		data: PageData;
	}

	let { data }: PageProps = $props();
</script>

<Metadata title="Create an account" />

<SignUp />
