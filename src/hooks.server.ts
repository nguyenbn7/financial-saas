import type { Handle } from '@sveltejs/kit';

import { ACCESS_TOKEN } from '$features/auth/constants';
import { verifyToken } from '$features/auth/server/service.server';
import { delay } from '$lib';

const { DEV } = import.meta.env;

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/api')) {
		const { cookies, locals } = event;
		const accessToken = cookies.get(ACCESS_TOKEN);

		if (!accessToken) locals.user = undefined;
		else locals.user = await verifyToken(accessToken);
	}

	// Stimulate delay of request except Get page
	if (DEV) {
		if (event.url.pathname.startsWith('/api') && event.request.method === 'GET')
			await delay(0.5, 1);
		else await delay(1, 2);
	}

	return resolve(event);
};
