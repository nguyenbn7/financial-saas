<script lang="ts">
	interface Props {
		onCreate?: (value: string) => MaybePromise<void>;
		options: { label: string; value: string }[];
		disabled?: boolean;
		defaultValue?: string;
	}

	let { onCreate, options, disabled = false, defaultValue = $bindable('') }: Props = $props();
</script>
