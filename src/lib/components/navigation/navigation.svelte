<script lang="ts">
	import Logo from '$assets/logo.svg';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	import { page } from '$app/state';

	import qs from 'query-string';

	import { cn } from '$lib/utils';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Sheet, SheetContent, SheetTrigger } from '$lib/components/ui/sheet';

	import Menu from '@lucide/svelte/icons/menu';

	function stringifyUrl(url: string, query: Record<string, string | null | undefined>) {
		return qs.stringifyUrl({ url, query }, { skipEmptyString: true, skipNull: true });
	}

	const routes = $derived.by(() => {
		const { searchParams } = page.url;

		const query = {
			accountId: searchParams.get('accountId') ?? undefined,
			from: searchParams.get('from') ?? undefined,
			to: searchParams.get('to') ?? undefined
		};

		return [
			{
				href: stringifyUrl('/dashboard', query),
				label: 'Overview'
			},
			{
				href: stringifyUrl('/transactions', query),
				label: 'Transactions'
			},
			{
				href: '/accounts',
				label: 'Accounts'
			},
			{
				href: '/categories',
				label: 'Categories'
			},
			{
				href: '/settings',
				label: 'Settings'
			}
		];
	});
</script>

<nav class="hidden items-center gap-x-2 overflow-x-auto lg:flex">
	{#each routes as route}
		<a
			class="mb-2 me-2 rounded-lg px-3 py-2 text-center text-sm font-medium text-white outline-hidden hover:bg-white/20 focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0 transition{page
				.url.pathname === route.href
				? ' bg-white/10'
				: ''}"
			href={route.href}>{route.label}</a
		>
	{/each}
</nav>

<Sheet>
	<SheetTrigger
		class={cn(
			buttonVariants({ variant: 'outline', size: 'sm' }),
			'lg:hidden',
			'font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-hidden text-white focus:bg-white/30 transition'
		)}
		><Menu />
	</SheetTrigger>

	<SheetContent side="left" class="px-2">
		<div class="w-full flex justify-start items-center pt-5 px-4">
			<img class="h-7 w-7" src={Logo} alt="logo" />
			<span class="ml-2.5 text-xl font-semibold text-primary">
				{PUBLIC_APP_NAME}
			</span>
		</div>
		<nav class="flex flex-col gap-y-2 pt-6">
			{#each routes as route}
				<Button
					href={route.href}
					variant={page.url.pathname === route.href ? 'secondary' : 'ghost'}
					class="w-full justify-start">{route.label}</Button
				>
			{/each}
		</nav>
	</SheetContent>
</Sheet>
