import type { User } from '$lib/db.schemas';

import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { ACCESS_TOKEN } from '$features/auth/constants';
import { verifyToken } from '$features/auth/server/service.server';

type UserWithoutPassword = Omit<User, 'password'>;

type AuthEnv = {
	Variables: {
		user: UserWithoutPassword;
	};
};

export const authenticate = createMiddleware<AuthEnv>(async (c, next) => {
	const accessToken = getCookie(c, ACCESS_TOKEN);

	if (!accessToken) return c.json({ error: 'Unauthorized' }, 401);

	const user = await verifyToken(accessToken);
	if (!user) return c.json({ error: 'Unauthorized' }, 401);

	c.set('user', user);

	await next();
});
