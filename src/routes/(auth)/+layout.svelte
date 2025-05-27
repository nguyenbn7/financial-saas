<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import Loader from '@lucide/svelte/icons/loader-circle';

	import { ClerkLoaded, ClerkLoading } from 'svelte-clerk';

	interface LayoutProps {
		data: LayoutData;
		children: Snippet;
	}

	const { data, children }: LayoutProps = $props();
</script>

<div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
	<div class="max-w-md w-full">
		<!-- <a href="/" class="flex items-center mb-8 justify-center">
			<img class="h-8 w-12" src={Logo} alt="logo" />
			<span class="ml-2.5 text-2xl font-semibold dark:text-white text-gray-800">
				{PUBLIC_APP_NAME}
			</span>
		</a> -->

		<div class="flex items-center justify-center">
			<ClerkLoading>
				<Loader size={16} class="size-28 animate-spin ml-1" />
			</ClerkLoading>

			<ClerkLoaded>
				{@render children()}
			</ClerkLoaded>
		</div>
	</div>
</div>
