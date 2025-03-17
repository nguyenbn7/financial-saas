import type { RequestHandler } from './$types';

import { ACCESS_TOKEN } from '$features/auth/constants';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	const { user } = locals;

	if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

	cookies.set(ACCESS_TOKEN, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});

	locals.user = undefined;

	return new Response(JSON.stringify({ success: true }), { status: 401 });
};
