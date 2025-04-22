<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { format, isMatch, parse, isValid } from 'date-fns';
	import { options } from '$lib/currency';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import ImportTable from './import-table.svelte';

	interface Props {
		data: string[][];
		onCancel: () => void;
		onSubmit: (data: any) => void;
	}

	const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
	const dateFormat = 'yyyy-MM-dd';
	const outputFormat = 'yyyy-MM-dd';

	const requiredOptions = ['amount', 'date', 'payee'];

	interface SelectedColumnState {
		[key: string]: string | null;
	}

	let { data, onCancel, onSubmit }: Props = $props();

	let selectedColumns = $state<SelectedColumnState>({});

	const headers = data[0];
	const body = data.slice(1);

	function onTableHeadSelectChange(columnIndex: number, value: string | null) {
		const newSelectedColumns = { ...selectedColumns };

		for (const key in newSelectedColumns) {
			if (newSelectedColumns[key] === value) {
				newSelectedColumns[key] = null;
			}
		}

		if (value === 'skip') value = null;

		newSelectedColumns[`column_${columnIndex}`] = value;

		selectedColumns = { ...newSelectedColumns };
	}

	const progress = $derived(Object.values(selectedColumns).filter(Boolean).length);

	function handleContinue() {
		const mappedData = {
			headers: headers.map((_header, index) => {
				return selectedColumns[`column_${index}`] ?? null;
			}),
			body: body
				.map((row) => {
					const transformedRow = row.map((cell, idx) =>
						selectedColumns[`column_${idx}`] ? cell : null
					);
					return transformedRow.every((item) => item === null) ? [] : transformedRow;
				})
				.filter((row) => row.length > 0)
		};

		const arrayOfData = mappedData.body.map((row) => {
			return row.reduce((acc: Record<string, string>, cell, index) => {
				const header = mappedData.headers[index];
				if (header !== null) acc[header] = cell as string;
				return acc;
			}, {});
		});

		const formattedData = arrayOfData.map((item) => {
			if (isNaN(+item.amount)) {
				const message = 'Column "Amount" must be numbers';
				toast.error(message);
				throw TypeError(message);
			}
			const fractionDigits = Math.pow(10, options.maximumFractionDigits!);
			const amount = Number((parseFloat(item.amount) * fractionDigits).toFixed(0));

			let parsedDate: Date;

			if (isMatch(item.date, dateFormat)) parsedDate = parse(item.date, dateFormat, new Date());
			else if (isMatch(item.date, dateTimeFormat))
				parsedDate = parse(item.date, dateTimeFormat, new Date());
			else {
				const message = `Column "Date" must be format: "${dateFormat}" or "${dateTimeFormat}"`;
				toast.error(message);
				throw RangeError(message);
			}

			const date = format(parsedDate, outputFormat);

			return {
				...item,
				amount,
				date
			};
		});

		onSubmit(formattedData);
	}
</script>

<Card class="border-none drop-shadow-sm max-w-screen-2xl w-full mx-auto">
	<CardHeader class="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
		<CardTitle class="text-xl line-clamp-1">Import Transaction</CardTitle>

		<div class="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
			<Button class="w-full lg:w-auto" size="sm" onclick={onCancel}>Cancel</Button>

			<Button
				class="w-full lg:w-auto"
				size="sm"
				disabled={progress < requiredOptions.length}
				onclick={handleContinue}
				>Continue ({progress} / {requiredOptions.length})
			</Button>
		</div>
	</CardHeader>

	<CardContent>
		<ImportTable {headers} {body} {selectedColumns} {onTableHeadSelectChange} />
	</CardContent>
</Card>
