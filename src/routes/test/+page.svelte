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
</script>

<div class="w-32 mx-auto mt-10">
	<CreatableSelect
		options={frameworks}
		onCreate={(value) => {
			frameworks.push({
				value,
				label: value
			});
			console.log(value);
		}}
	/>
</div>
