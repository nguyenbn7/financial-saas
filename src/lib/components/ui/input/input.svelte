<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined }) &
			(
				| {
						type: 'currency';
						fractionDigits?: number;
						locales?: Intl.LocalesArgument;
						options?: Intl.NumberFormatOptions;
				  }
				| { type?: InputType; locales?: undefined; options?: undefined }
			)
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		locales = 'en-US',
		options = {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		},
		...restProps
	}: Props = $props();

	const fractionDigits = Math.pow(10, options.maximumFractionDigits ?? 2);
	const currencyFormatter = Intl.NumberFormat(locales, options);

	let currency = $state(
		isNaN(Number(value)) ? '0' : currencyFormatter.format(Number(value) / fractionDigits)
	);

	if (type === 'currency') {
		const trackingNumValue = $derived(Number(value));

		$effect(() => {
			if (isNaN(trackingNumValue)) {
				value = 0;
			}

			currency = currencyFormatter.format(value / fractionDigits);
		});
	}
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		class={cn(
			'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else if type === 'currency'}
	<input
		bind:this={ref}
		class={cn(
			'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			className
		)}
		type="text"
		bind:value={
			() => currency,
			(newValue) => {
				currency = newValue;
				if (newValue.at(-1) === '-') currency = `-${currency}`;
				const numericValue = Number(currency.replace(/(?!^-)\D/g, ''));
				value = numericValue;
			}
		}
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		class={cn(
			'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
