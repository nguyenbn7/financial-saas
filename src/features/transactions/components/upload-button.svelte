<script lang="ts">
	import Papa, { type ParseResult } from 'papaparse';
	import { Button } from '$lib/components/ui/button';
	import Upload from '@lucide/svelte/icons/upload';

	interface Props {
		onUpload: (results: ParseResult<unknown>) => void;
	}

	let { onUpload }: Props = $props();

	let inputRef: HTMLInputElement | undefined = $state();
</script>

<input
	type="file"
	autocomplete="off"
	tabindex="-1"
	hidden
	accept="text/csv, .csv, application/vnd.ms-excel"
	bind:this={inputRef}
	onchange={(e) => {
		const files = e.currentTarget.files;

		if (files) {
			Papa.parse(files[0], {
				complete(results, file) {
					onUpload(results);
				}
			});
		}
	}}
/>

<Button size="sm" class="w-full lg:w-auto" onclick={() => inputRef?.click()}>
	<Upload class="size-4 mr-2" /> Import
</Button>
