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

	let { value = $bindable(), placeholder, disabled = false, ...restProps }: Props = $props();
</script>

<Input type="currency" {placeholder} {disabled} {...restProps} bind:value />
