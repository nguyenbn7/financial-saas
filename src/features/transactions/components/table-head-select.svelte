<script lang="ts">
	import { cn } from '$lib/utils';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

	interface Props {
		columnIndex: number;
		selectedColumns: Record<string, string | null>;
		onChange: (columnIndex: number, value: string | null) => void;
	}

	let { columnIndex, selectedColumns, onChange }: Props = $props();

	const options = ['amount', 'date', 'payee', 'notes'];

	const currentSelect = $derived(selectedColumns[`column_${columnIndex}`]);
</script>

<Select
	value={currentSelect ?? ''}
	type="single"
	onValueChange={(value) => onChange(columnIndex, value)}
>
	<SelectTrigger
		class={cn(
			'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
			currentSelect && 'text-blue-500'
		)}
	>
		{currentSelect ?? 'Skip'}
	</SelectTrigger>

	<SelectContent>
		<SelectItem value="skip">Skip</SelectItem>
		{#each options as option, index (index)}
			{@const disabled =
				Object.values(selectedColumns).includes(option) &&
				selectedColumns[`column_${columnIndex}`] !== option}

			<SelectItem value={option} class="capitalize" {disabled}>{option}</SelectItem>
		{/each}
	</SelectContent>
</Select>
