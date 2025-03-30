<script>
	import { CreatableSelect } from '$lib/components/select';

	const frameworks = $state([
		{
			value: 'sveltekit',
			label: 'SvelteKit'
		},
		{
			value: 'next.js',
			label: 'Next.js'
		},
		{
			value: 'nuxt.js',
			label: 'Nuxt.js'
		},
		{
			value: 'remix',
			label: 'Remix'
		},
		{
			value: 'astro',
			label: 'Astro'
		}
	]);

	let value = $state('');
</script>

<div class="w-32 mx-auto mt-10">
	<CreatableSelect
		bind:value
		options={frameworks}
		onCreate={(newValue) => {
			frameworks.push({
				value: newValue,
				label: newValue
			});
			value = newValue;
		}}
		onChange={(option) => {
			value = option.value;
		}}
	/>
</div>
