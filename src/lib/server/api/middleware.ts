import type { MiddlewareHandler } from 'hono';
import type { ClerkClient } from '@clerk/backend';

import { StatusCodes } from 'http-status-codes';

import { getAuth } from '@hono/clerk-auth';

type ClerkAuth = ReturnType<Awaited<ReturnType<ClerkClient['authenticateRequest']>>['toAuth']>;

interface ClerkEnv {
	Variables: {
		clerk: ClerkClient;
		clerkAuth: ClerkAuth;
		userId: string;
	};
}

export const clerkMiddlewareAuthenticated = (): MiddlewareHandler<ClerkEnv> => async (c, next) => {
	const auth = getAuth(c);

	if (!auth?.userId) {
		return c.json(
			{
				error: {
					code: StatusCodes.UNAUTHORIZED,
					message: 'Login required'
				}
			},
			StatusCodes.UNAUTHORIZED
		);
	}

	c.set('userId', auth.userId);

	await next();
};
