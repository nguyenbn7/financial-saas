<script lang="ts" module>
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import Logo from '$assets/logo.svg';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	import Navigation from '$lib/components/navigation.svelte';
	import UserButton from '$features/auth/components/user-button.svelte';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();

	let { user } = data;
</script>

<header class="bg-linear-to-b from-primary-700 to-primary-500 px-4 pt-8 pb-36 lg:px-14">
	<div class="mx-auto max-w-(--breakpoint-2xl)">
		<div class="mb-14 flex w-full items-center justify-between">
			<div class="flex items-center lg:gap-x-16">
				<!-- Header Logo -->
				<a href="/dashboard" class="hidden items-center lg:flex">
					<img class="h-7 w-7" src={Logo} alt="logo" />
					<span class="ml-2.5 text-2xl font-semibold text-white">
						{PUBLIC_APP_NAME}
					</span>
				</a>

				<Navigation />
			</div>

			<UserButton displayName={user.name} />
		</div>

		<div class="mb-4 space-y-2">
			<h2 class="text-2xl font-medium text-white lg:text-4xl">Welcome back, {user.name} 👋🏻</h2>
			<p class="text-sm text-[#89b6fd] lg:text-base">This is your Financial Overview Report</p>
		</div>
	</div>
</header>

{@render children()}
