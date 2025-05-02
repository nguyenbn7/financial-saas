<script lang="ts">
	import type { ButtonProps } from '$lib/components/ui/button';

	import Plus from '@lucide/svelte/icons/plus';

	import { Button } from '$lib/components/ui/button';

	let { ...restProps }: ButtonProps = $props();
</script>

<Button size="sm" {...restProps}>
	<Plus class="size-4 mr-2" /> Add new
</Button>
