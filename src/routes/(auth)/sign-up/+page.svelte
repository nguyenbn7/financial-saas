<script lang="ts">
	import type { PageData } from './$types';

	import { Metadata } from '$lib/components/metadata';

	import { dark } from '@clerk/themes';
	import { mode } from 'mode-watcher';

	import { SignUp } from 'svelte-clerk/client';

	interface PageProps {
		data: PageData;
	}

	const { data }: PageProps = $props();
</script>

<Metadata title="Create an account" />

<SignUp appearance={{ baseTheme: mode.current === 'dark' ? dark : undefined }} />
