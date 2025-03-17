<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import '../app.css';

	import { Toaster } from '$components/ui/sonner';
	import BackToTop from '$components/back-to-top.svelte';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Toaster richColors closeButton theme="light" />

{@render children()}

<BackToTop />
