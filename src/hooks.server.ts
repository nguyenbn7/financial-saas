import type { Handle } from '@sveltejs/kit';

import { ACCESS_TOKEN } from '$features/auth/constants';
import { verifyToken } from '$features/auth/server/service.server';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/api')) {
		const { cookies, locals } = event;
		const accessToken = cookies.get(ACCESS_TOKEN);

		if (!accessToken) locals.user = undefined;
		else locals.user = await verifyToken(accessToken);
	}

	return resolve(event);
};
