<script lang="ts">
	import { goto } from '$app/navigation';

	import { createAvatar } from '@dicebear/core';
	import { adventurer } from '@dicebear/collection';

	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuGroupHeading,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$components/ui/dropdown-menu';
	import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';

	import { LogOut, User } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		displayName: string;
	}

	let { displayName }: Props = $props();

	const avatar = createAvatar(adventurer, {
		seed: 'Sophia',
		backgroundColor: ['d1d4f9', 'ffdfbf'],
		backgroundType: ['gradientLinear']
	});
</script>

<DropdownMenu>
	<DropdownMenuTrigger class="hover:cursor-pointer" title={displayName}>
		<Avatar>
			<AvatarImage src={avatar.toDataUri()} alt={displayName} />
			<AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
		</Avatar>
	</DropdownMenuTrigger>

	<DropdownMenuContent align="end">
		<DropdownMenuGroup>
			<DropdownMenuGroupHeading>{displayName}</DropdownMenuGroupHeading>
			<DropdownMenuSeparator />
			<DropdownMenuItem class="hover:cursor-pointer">
				<User class="mr-1" />
				<span>Profile</span>
			</DropdownMenuItem>

			<DropdownMenuSeparator />

			<!-- TODO: update logic of this -->
			<DropdownMenuItem
				class="hover:cursor-pointer text-destructive/80 font-bold data-[highlighted]:text-destructive w-full"
			>
				{#snippet child({ props })}
					<button
						{...props}
						onclick={async () => {
							const response = await fetch('/log-out', { method: 'POST' });
							const data = (await response.json()) as
								| { success: boolean; error: undefined }
								| { success: undefined; error: string };

							if (data.success) {
								toast.success('Good bye');
							}

							return goto('/', { invalidateAll: true });
						}}
					>
						<LogOut class="mr-1" />
						<span>Log out</span>
					</button>
				{/snippet}
			</DropdownMenuItem>
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
