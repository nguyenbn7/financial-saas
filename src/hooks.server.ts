import type { Handle } from '@sveltejs/kit';
import { ACCESS_TOKEN } from '$features/auth/auth.constants';
import { verifyToken } from '$features/auth/server/auth.server';

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event;
	const accessToken = cookies.get(ACCESS_TOKEN);

	if (!accessToken) locals.user = undefined;
	else locals.user = await verifyToken(accessToken);

	return resolve(event);
};
