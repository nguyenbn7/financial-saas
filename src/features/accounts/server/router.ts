import type { RequestIdVariables } from 'hono/request-id';

import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { accountSchema, accountIdSchema, deleteAccountsSchema } from '$features/accounts/schema';
import {
	createAccount,
	deleteAccounts,
	getAccount,
	getAccounts,
	updateAccount
} from '$features/accounts/server/repository';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

interface Env {
	Variables: RequestIdVariables;
}

const app = new Hono<Env>()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', async (c) => {
		const { userId } = c.var;

		const accounts = await getAccounts({ userId });

		return c.json({
			accounts
		});
	})
	.get('/:id', zValidator('param', accountIdSchema), async (c) => {
		const { userId } = c.var;
		const { id } = c.req.valid('param');

		const [account] = await getAccount({ id, userId });

		if (!account) {
			const { requestId } = c.var;

			return c.json(
				{
					requestId,
					status: StatusCodes.NOT_FOUND,
					title: ReasonPhrases.NOT_FOUND,
					detail: `Account with id '${id}' not found`
				},
				StatusCodes.NOT_FOUND
			);
		}

		return c.json({
			account
		});
	})
	.post('/', zValidator('json', accountSchema), async (c) => {
		const { userId } = c.var;
		const jsonData = c.req.valid('json');

		const [account] = await createAccount({ userId, ...jsonData });

		if (!account) {
			const { requestId } = c.var;

			return c.json(
				{
					requestId,
					status: StatusCodes.UNPROCESSABLE_ENTITY,
					title: ReasonPhrases.UNPROCESSABLE_ENTITY,
					detail: 'Cannot create account'
				},
				StatusCodes.UNPROCESSABLE_ENTITY
			);
		}

		return c.json({
			account
		});
	})
	.put(
		'/:id',
		zValidator('param', accountIdSchema),
		zValidator('json', accountSchema),
		async (c) => {
			const { userId } = c.var;
			const { id } = c.req.valid('param');
			const jsonData = c.req.valid('json');

			const [existedAccount] = await getAccount({ id, userId });

			if (!existedAccount) {
				const { requestId } = c.var;

				return c.json(
					{
						requestId,
						status: StatusCodes.NOT_FOUND,
						title: ReasonPhrases.NOT_FOUND,
						detail: `Account with id '${id}' not found`
					},
					StatusCodes.NOT_FOUND
				);
			}

			const [account] = await updateAccount({ id, userId }, { ...jsonData });

			if (!account) {
				const { requestId } = c.var;

				return c.json(
					{
						requestId,
						status: StatusCodes.UNPROCESSABLE_ENTITY,
						title: ReasonPhrases.UNPROCESSABLE_ENTITY,
						detail: 'Cannot update account'
					},
					StatusCodes.UNPROCESSABLE_ENTITY
				);
			}

			return c.json({
				account
			});
		}
	)
	.delete('/', zValidator('json', deleteAccountsSchema), async (c) => {
		const { userId } = c.var;
		const formData = c.req.valid('json');

		const deletedAccountIds = await deleteAccounts({ ...formData, userId });

		return c.json({
			deletedAccountIds
		});
	});

export default app;
