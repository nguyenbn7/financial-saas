<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	import { PUBLIC_APP_NAME } from '$env/static/public';

	import toLower from 'lodash/toLower';
	import startCase from 'lodash/startCase';

	import { ClerkLoaded, ClerkLoading, UserButton } from 'svelte-clerk/client';

	import { Navigation } from '$lib/components/navigation';
	import { Filters } from '$lib/components/filters';

	import { NewAccountSheet, EditAccountSheet } from '$features/accounts/components';
	import { NewCategorySheet, EditCategorySheet } from '$features/categories/components';
	import { NewTransactionSheet, EditTransactionSheet } from '$features/transactions/components';

	import Logo from '$assets/logo.svg';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface LayoutProps {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: LayoutProps = $props();
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

			<ClerkLoading>
				<LoaderCircle size={32} class="mr-1 text-white animate-spin" />
			</ClerkLoading>

			<ClerkLoaded>
				<UserButton />
			</ClerkLoaded>
		</div>

		<div class="mb-4 space-y-2">
			<h2 class="text-2xl font-medium text-white lg:text-4xl">
				{#if data.userDisplayName}
					Welcome back, {startCase(toLower(data.userDisplayName))} 👋🏻
				{:else}
					Welcome to Financial Portal 👋🏻
				{/if}
			</h2>
			<p class="text-sm text-[#89b6fd] lg:text-base">This is your Financial Overview Report</p>
		</div>

		<Filters />
	</div>
</header>

<div class="px-3 lg:px-14">
	{@render children()}
</div>

<NewAccountSheet />
<EditAccountSheet />
<NewCategorySheet />
<EditCategorySheet />
<NewTransactionSheet />
<EditTransactionSheet />
