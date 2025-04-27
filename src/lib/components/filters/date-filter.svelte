<script lang="ts">
	import type { DateRange } from 'bits-ui';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { format, subDays } from 'date-fns';
	import { getLocalTimeZone, parseAbsoluteToLocal, parseDate } from '@internationalized/date';
	import qs from 'query-string';
	import { formatDateRange } from '$lib';
	import { Button } from '$lib/components/ui/button';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import {
		Popover,
		PopoverTrigger,
		PopoverContent,
		PopoverClose
	} from '$lib/components/ui/popover';

	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	const accountId = $derived(page.url.searchParams.get('accountId'));
	const from = $derived(page.url.searchParams.get('from') || '');
	const to = $derived(page.url.searchParams.get('to') || '');

	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const paramState = $derived({
		from: from ? new Date(from) : defaultFrom,
		to: to ? new Date(to) : defaultTo
	});

	let date = $derived<DateRange>({
		start: parseAbsoluteToLocal(paramState.from.toISOString()),
		end: parseAbsoluteToLocal(paramState.to.toISOString())
	});

	async function goToUrl(dateRange: DateRange) {
		const query = {
			accountId,
			from: dateRange.start
				? format(dateRange.start.toDate(getLocalTimeZone()), 'yyyy-MM-dd')
				: undefined,
			to: dateRange.end ? format(dateRange.end.toDate(getLocalTimeZone()), 'yyyy-MM-dd') : undefined
		};

		const { pathname } = page.url;

		const url = qs.stringifyUrl(
			{ url: pathname, query },
			{ skipNull: true, skipEmptyString: true }
		);

		return goto(url, { replaceState: true, noScroll: true });
	}

	async function onReset() {
		date = { start: undefined, end: undefined };
		return goToUrl({ start: undefined, end: undefined });
	}
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
				disabled={false}
				size="sm"
				variant="outline"
			>
				<span>{formatDateRange(paramState)}</span>
				<ChevronDown class="ml-2 size-4 opacity-50" />
			</Button>
		{/snippet}
	</PopoverTrigger>

	<PopoverContent align="start" class="lg:w-auto w-full p-0">
		<RangeCalendar bind:value={date} disabled={false} numberOfMonths={2}>
			{#snippet footer()}
				<div class="p-4 w-full flex items-center gap-x-2">
					<PopoverClose>
						{#snippet child({ props })}
							<Button
								{...props}
								onclick={onReset}
								disabled={!date?.start || !date.end}
								class="w-full"
								variant="outline"
							>
								Reset
							</Button>
						{/snippet}
					</PopoverClose>

					<PopoverClose>
						{#snippet child({ props })}
							<Button
								{...props}
								onclick={() => goToUrl(date)}
								disabled={!date?.start || !date.end}
								class="w-full"
							>
								Apply
							</Button>
						{/snippet}
					</PopoverClose>
				</div>
			{/snippet}
		</RangeCalendar>
	</PopoverContent>
</Popover>
