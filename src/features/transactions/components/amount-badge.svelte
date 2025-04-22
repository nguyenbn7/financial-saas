<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		amount: number;
	}

	let { amount }: Props = $props();

	const formatter = Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	});
</script>

<Badge variant={amount < 0 ? 'negative' : 'positive'} class="text-xs font-medium px-3.5 py-2.5">
	{formatter.format(amount)}
</Badge>
