<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import '../app.css';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import { Toaster } from '$lib/components/ui/sonner';

	import { BackToTop as BackToTopButton } from '$lib/components/button';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();

	const queryClient = new QueryClient();
</script>

<Toaster richColors closeButton theme="light" />

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>

<BackToTopButton />
