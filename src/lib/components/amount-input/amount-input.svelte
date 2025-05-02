<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import MinusCircle from '@lucide/svelte/icons/minus-circle';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';

	import { cn } from '$lib/utils';

	import { Input } from '$lib/components/ui/input';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';

	interface Props {
		value: number;
		disabled?: boolean;
	}

	let { value = $bindable(0), disabled = false, ...restProps }: Props = $props();

	const isIncome = $derived(value > 0);
	const isExpense = $derived(value < 0);

	function onReverseValue() {
		if (!value) return;
		value *= -1;
	}
</script>

<div class="relative">
	<TooltipProvider>
		<Tooltip delayDuration={100}>
			<TooltipTrigger>
				{#snippet child({ props })}
					<button
						type="button"
						onclick={onReverseValue}
						class={cn(
							'bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition',
							isIncome && 'bg-emerald-500 hover:bg-emerald-600',
							isExpense && 'bg-rose-500 hover:bg-rose-600'
						)}
					>
						{#if isIncome}
							<PlusCircle class="size-3 text-white" />
						{:else if isExpense}
							<MinusCircle class="size-3 text-white" />
						{:else}
							<Info class="size-3 text-white" />
						{/if}
					</button>
				{/snippet}
			</TooltipTrigger>

			<TooltipContent>Use [+] for income and [-] for expenses</TooltipContent>
		</Tooltip>
	</TooltipProvider>

	<Input type="currency" {disabled} {...restProps} bind:value class="pl-10" />

	<p class="text-xs text-muted-foreground mt-2">
		{#if isIncome}
			This will count as income
		{:else if isExpense}
			This will count as an expense
		{/if}
	</p>
</div>
