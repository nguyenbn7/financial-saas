<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { formatter as currencyFormater } from '$lib/currency';

	interface Props {
		amount: number;
	}

	let { amount }: Props = $props();
</script>

<Badge variant={amount < 0 ? 'negative' : 'positive'} class="text-xs font-medium px-3.5 py-2.5">
	{currencyFormater.format(amount / 100)}
</Badge>
