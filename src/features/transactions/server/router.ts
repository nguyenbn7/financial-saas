import type { RequestIdVariables } from 'hono/request-id';

import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import {
	bulkCreateTransactionSchema,
	deleteTransactionsSchema,
	querySchema,
	transactionSchema,
	transactionIdSchema
} from '$features/transactions/schema';
import {
	createTransaction,
	createTransactions,
	deleteTransactions,
	getTransaction,
	getTransactions,
	updateTransaction
} from '$features/transactions/server/repository';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { parse, subDays } from 'date-fns';

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
	.get('/', zValidator('query', querySchema), async (c) => {
		const { userId } = c.var;

		const { from, to, accountId } = c.req.valid('query');

		const defaultTo = new Date();
		const defaultFrom = subDays(defaultTo, 30);

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

		return c.json({
			transactions: await getTransactions({
				userId,
				accountId,
				startDate,
				endDate
			})
		});
	})
	.get('/:id', zValidator('param', transactionIdSchema), async (c) => {
		const { userId } = c.var;
		const { id } = c.req.valid('param');

		const [transaction] = await getTransaction({ id, userId });

		if (!transaction) {
			const { requestId } = c.var;

			return c.json(
				{
					requestId,
					status: StatusCodes.NOT_FOUND,
					title: ReasonPhrases.NOT_FOUND,
					detail: `Transaction with id '${id}' not found`
				},
				StatusCodes.NOT_FOUND
			);
		}

		return c.json({
			transaction
		});
	})
	.post('/', zValidator('json', transactionSchema), async (c) => {
		const formData = c.req.valid('json');

		const [transaction] = await createTransaction({ ...formData });

		if (!transaction) {
			const { requestId } = c.var;

			return c.json(
				{
					requestId,
					status: StatusCodes.UNPROCESSABLE_ENTITY,
					title: ReasonPhrases.UNPROCESSABLE_ENTITY,
					detail: 'Cannot create transaction'
				},
				StatusCodes.UNPROCESSABLE_ENTITY
			);
		}

		return c.json({
			transaction
		});
	})
	.post('/$bulk', zValidator('json', bulkCreateTransactionSchema), async (c) => {
		const body = c.req.valid('json');

		const transactions = await createTransactions(body);

		return c.json({
			transactions
		});
	})
	.put(
		'/:id',
		zValidator('param', transactionIdSchema),
		zValidator('json', transactionSchema),
		async (c) => {
			const { userId } = c.var;
			const { id } = c.req.valid('param');
			const jsonData = c.req.valid('json');

			const [existedTransaction] = await getTransaction({ id, userId });

			if (!existedTransaction) {
				const { requestId } = c.var;

				return c.json(
					{
						requestId,
						status: StatusCodes.NOT_FOUND,
						title: ReasonPhrases.NOT_FOUND,
						detail: `Transaction with id '${id}' not found`
					},
					StatusCodes.NOT_FOUND
				);
			}

			const [transaction] = await updateTransaction({ id, userId }, { ...jsonData });

			if (!transaction) {
				const { requestId } = c.var;

				return c.json(
					{
						requestId,
						status: StatusCodes.UNPROCESSABLE_ENTITY,
						title: ReasonPhrases.UNPROCESSABLE_ENTITY,
						detail: 'Cannot update transaction'
					},
					StatusCodes.UNPROCESSABLE_ENTITY
				);
			}

			return c.json({
				transaction
			});
		}
	)
	.delete('/', zValidator('json', deleteTransactionsSchema), async (c) => {
		const { userId } = c.var;
		const jsonData = c.req.valid('json');

		const deletedTransactionIds = await deleteTransactions({ ...jsonData, userId });

		return c.json({
			deletedTransactionIds
		});
	});

export default app;
