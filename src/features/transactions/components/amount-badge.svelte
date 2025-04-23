<script lang="ts">
	import { formatCurrency } from '$lib';
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		amount: number;
	}

	let { amount }: Props = $props();
</script>

<Badge variant={amount < 0 ? 'negative' : 'positive'} class="text-xs font-medium px-3.5 py-2.5">
	{formatCurrency(amount)}
</Badge>
