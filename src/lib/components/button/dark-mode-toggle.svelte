<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';

	import { cn } from '$lib/utils';
	import { resetMode, setMode } from 'mode-watcher';
	import { buttonVariants } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), className)}>
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>

		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenuTrigger>

	<DropdownMenuContent align="end">
		<DropdownMenuItem onclick={() => setMode('light')}>Light</DropdownMenuItem>
		<DropdownMenuItem onclick={() => setMode('dark')}>Dark</DropdownMenuItem>
		<DropdownMenuItem onclick={() => resetMode()}>System</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
