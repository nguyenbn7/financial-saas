import type { MiddlewareHandler } from 'hono';
import type { ClerkClient } from '@clerk/backend';
import type { RequestIdVariables } from 'hono/request-id';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { getAuth } from '@hono/clerk-auth';

type ClerkAuth = ReturnType<Awaited<ReturnType<ClerkClient['authenticateRequest']>>['toAuth']>;

interface ClerkEnv {
	Variables: {
		clerk: ClerkClient;
		clerkAuth: ClerkAuth;
		userId: string;
	} & RequestIdVariables;
}

export const clerkMiddlewareAuthenticated = (): MiddlewareHandler<ClerkEnv> => async (c, next) => {
	const auth = getAuth(c);

	if (!auth?.userId) {
		const { requestId } = c.var;

		return c.json(
			{
				requestId,
				status: StatusCodes.UNAUTHORIZED,
				title: ReasonPhrases.UNAUTHORIZED,
				detail: 'Login required'
			},
			StatusCodes.UNAUTHORIZED
		);
	}

	c.set('userId', auth.userId);

	await next();
};
