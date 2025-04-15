<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import '../app.css';

	import { QueryClientProvider } from '@tanstack/svelte-query';

	import { Toaster } from '$lib/components/ui/sonner';

	import { BackToTop as BackToTopButton } from '$lib/components/button';
	import { ConfirmDialog } from '$lib/components/confirm-dialog';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Toaster richColors closeButton theme="light" />

<ConfirmDialog />

<QueryClientProvider>
	{@render children()}
</QueryClientProvider>

<BackToTopButton />
