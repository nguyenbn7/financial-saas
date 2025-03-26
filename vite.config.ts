import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		warmup: {
			clientFiles: [
				'./node_modules/svelte-sonner/dist/Toast.svelte',
				'./src/app.css',
				'./src/routes/(root)/+page.svelte',
				'./src/routes/+layout.svelte',
				'./src/lib/utils.ts',
				'./src/lib/components/ui/button/index.ts'
			]
		}
	}
});
