<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	import { cn } from '$lib/utils';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';

	import Info from '@lucide/svelte/icons/info';
	import MinusCircle from '@lucide/svelte/icons/minus-circle';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';

	interface Props {
		value: number;
		placeholder?: string;
		disabled?: boolean;
	}

	let {
		value: _value = $bindable(),
		placeholder,
		disabled = false,
		...restProps
	}: Props = $props();

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	});

	let value = $state(formatter.format(_value / 100));

	$effect(() => {
		let numericValue = Number(value.replace(/\D/g, ''));
		if (numericValue !== _value) numericValue = _value;
		value = formatter.format(numericValue / 100);
	});
</script>

<Input
	{...restProps}
	bind:value={
		() => value,
		(newValue) => {
			value = newValue;
			const numericValue = Number(value.replace(/\D/g, ''));
			_value = numericValue;
		}
	}
	{placeholder}
	{disabled}
/>
