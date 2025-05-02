<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import '../app.css';

	import { BackToTopButton } from '$lib/components/button';
	import { ConfirmDialog } from '$lib/components/confirm-dialog';

	import { browser } from '$app/environment';

	import { ClerkProvider } from 'svelte-clerk';

	import { Toaster } from '$lib/components/ui/sonner';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

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
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				// staleTime: 1000 // 1 sec
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
