<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from 'tailwind-variants';
	import { formatCurrency, formatPercentage } from '$lib';
	import { cn } from '$lib/utils';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { CountUp } from '$lib/components/count-up';

	const boxVariants = tv({
		base: 'rounded-md p-3',
		variants: {
			variant: {
				default: 'bg-blue-500/20',
				success: 'bg-emerald-500/20',
				danger: 'bg-rose-500/20',
				warning: 'bg-yellow-500/20'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	const iconVariants = tv({
		base: 'size-6',
		variants: {
			variant: {
				default: 'fill-blue-500',
				success: 'fill-emerald-500',
				danger: 'fill-rose-500',
				warning: 'fill-yellow-500'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	type BoxVariants = VariantProps<typeof boxVariants>['variant'];
	type IconVariants = VariantProps<typeof iconVariants>['variant'];

	interface Props {
		variant?: BoxVariants & IconVariants;
		title: string;
		value?: number;
		dateRange: string;
		percentageChange?: number;
		icon: Snippet<[{ class: string }]>;
	}

	let { variant, title, value = 0, dateRange, percentageChange = 0, icon }: Props = $props();
</script>

<Card class="border-none drop-shadow-sm">
	<CardHeader class="flex flex-row items-center justify-between gap-x-4">
		<div class="space-y-2">
			<CardTitle class="text-2xl line-clamp-1">
				{title}
			</CardTitle>

			<CardDescription class="line-clamp-1">
				{dateRange}
			</CardDescription>
		</div>

		<div class={cn('shrink-0', boxVariants({ variant }))}>
			{@render icon({ class: cn(iconVariants({ variant })) })}
		</div>
	</CardHeader>

	<CardContent>
		<h1 class="font-bold text-2xl mb-2 line-clamp-1 break-all">
			<CountUp
				preserveValue
				start={0}
				end={value}
				decimalPlaces={2}
				formattingFn={formatCurrency}
			/>
		</h1>

		<p
			class={cn(
				'text-muted-foreground text-sm line-clamp-1',
				percentageChange > 0 && 'text-emerald-500',
				percentageChange < 0 && 'text-rose-500'
			)}
		>
			{formatPercentage(percentageChange * 100, { addPrefix: true })} from last period
		</p>
	</CardContent>
</Card>
