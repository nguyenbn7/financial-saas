<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import '../app.css';

	import { browser } from '$app/environment';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import { ClerkProvider } from 'svelte-clerk';

	import { Toaster } from '$lib/components/ui/sonner';

	import { BackToTop as BackToTopButton } from '$lib/components/button';
	import { ConfirmDialog } from '$lib/components/confirm-dialog';

	interface LayoutProps {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: LayoutProps = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				refetchOnWindowFocus: false
			}
		}
	});
</script>

<Toaster richColors closeButton theme="light" position="top-right" />

<QueryClientProvider client={queryClient}>
	<ClerkProvider>
		{@render children()}
	</ClerkProvider>
</QueryClientProvider>

<BackToTopButton />

<ConfirmDialog />
