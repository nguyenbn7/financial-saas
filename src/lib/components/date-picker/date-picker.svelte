<script lang="ts">
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseAbsolute,
		parseAbsoluteToLocal,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	interface Props {
		value?: Date;
		disabled?: boolean;
	}

	let { value: _value = $bindable(), disabled = false }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let contentRef = $state<HTMLElement | null>(null);
	let value = $derived<DateValue | undefined>(
		_value ? parseAbsoluteToLocal(_value.toISOString()) : undefined
	);
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{disabled}
				variant="outline"
				class={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
			>
				<CalendarIcon class="size-4 mr-2" />
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent bind:ref={contentRef} class="w-auto p-0">
		<Calendar
			type="single"
			bind:value
			{disabled}
			initialFocus
			onValueChange={(v) => {
				if (v) {
					_value = v.toDate(getLocalTimeZone());
				} else {
					_value = undefined;
				}
			}}
		/>
	</PopoverContent>
</Popover>
