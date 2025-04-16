import type { Handle } from '@sveltejs/kit';

import { withClerkHandler } from 'svelte-clerk/server';
import { delay } from '$lib';

const { DEV } = import.meta.env;

export const handle: Handle = async ({ event, resolve }) => {
	if (
		DEV &&
		(event.request.method === 'POST' ||
			event.request.method === 'PUT' ||
			event.request.method === 'DELETE')
	)
		await delay(1, 2);

	if (event.url.pathname.startsWith('/api')) {
		if (DEV && event.request.method === 'GET') await delay(0.5, 1);

		return resolve(event);
	}

	return withClerkHandler()({ event, resolve });
};
