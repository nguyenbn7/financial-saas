<script lang="ts">
	import { Input } from '../ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

	interface Props {
		onCreate?: (value: string) => MaybePromise<void>;
		options?: { label: string; value: string }[];
		disabled?: boolean;
		defaultValue?: string;
	}

	let { onCreate, options, disabled = false, defaultValue = $bindable('') }: Props = $props();
	let open = $state(false);
	let value = $state('');
</script>

<Popover bind:open>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Input {...props} type={!open ? 'button' : 'text'} bind:value />
		{/snippet}
	</PopoverTrigger>
	<PopoverContent>
		<!-- <Command>
			
		</Command> -->
	</PopoverContent>
</Popover>
