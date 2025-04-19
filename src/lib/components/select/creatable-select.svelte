<script lang="ts">
	import { tick } from 'svelte';

	import { computeCommandScore, Command as CommandPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	import { Input } from '../ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
	import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';

	import Check from '@lucide/svelte/icons/check';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';

	interface Props {
		onValueChange?: (value: string) => void;
		onCreate?: (value: string) => MaybePromise<void>;
		options?: { label: string; value: string }[];
		value?: string;
		placeholder?: string;
		disabled?: boolean;
	}

	interface Extended {
		name?: string;
	}

	let {
		onCreate,
		onValueChange,
		placeholder,
		value = $bindable(''),
		options = [],
		disabled = false,
		...restProps
	}: Props & Extended = $props();

	let open = $state(false);
	let query = $state('');

	let triggerRef = $state<HTMLButtonElement>(null!);
	let likelihood = $state(0);

	let selectedLabel = $derived(options.find((f) => f.value === value)?.label);

	function customFilter(commandValue: string, search: string, commandKeywords?: string[]): number {
		const score = computeCommandScore(commandValue, search, commandKeywords);

		likelihood = score;

		return score;
	}

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	async function handleOnCreate() {
		if (onCreate && query) {
			await onCreate(query);
		}

		open = false;
		query = '';
	}

	$effect(() => {
		if (!open) query = '';
	});
</script>

{#snippet CommandAddItem()}
	<button
		tabindex={0}
		onclick={handleOnCreate}
		onkeydown={async (ev) => {
			if (ev.key === 'Enter') {
				await handleOnCreate();
			}
		}}
		class={cn(
			'flex w-full text-blue-500 cursor-pointer text-sm px-2 py-1.5 rounded-sm items-center focus:outline-none',
			'hover:bg-blue-200 focus:!bg-blue-200'
		)}
	>
		<CirclePlus size={16} class="mr-2 shrink-0" />
		Create
		<span class="overflow-ellipsis overflow-x-hidden whitespace-nowrap">"{query}"</span>
	</button>
{/snippet}

<Popover bind:open>
	<PopoverTrigger bind:ref={triggerRef} {...restProps}>
		{#snippet child({ props })}
			<!-- TODO: add chevron -->
			<Input
				{...props}
				type={!open ? 'button' : 'text'}
				value={!open ? (selectedLabel ?? placeholder) : query}
				role="listbox"
				class={cn('w-full', !open && 'text-left')}
				aria-expanded={open}
				{placeholder}
				tabindex={0}
				{disabled}
				oninput={(e) => {
					query = e.currentTarget.value;
				}}
			/>
		{/snippet}
	</PopoverTrigger>

	<PopoverContent
		class={cn('p-0', 'w-[var(--bits-popover-anchor-width)]')}
		sideOffset={10}
		trapFocus={false}
	>
		<Command filter={customFilter}>
			<CommandPrimitive.Input hidden value={query} />

			{#if query && likelihood < 1}
				<div class="p-1 text-sm">
					{@render CommandAddItem()}
				</div>
			{/if}

			{#if options.length === 0 && !query}
				<div class="py-5 text-center text-sm">No items</div>
			{/if}

			<CommandList>
				<CommandGroup class="overflow-y-auto">
					{#each options as option}
						<CommandItem
							tabindex={0}
							value={option.label}
							onSelect={() => {
								onValueChange?.(option.value);
								value = option.value;
								closeAndFocusTrigger();
							}}
						>
							<Check class={cn('mr-2 size-4', value !== option.value && 'text-transparent')} />
							{option.label}
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
