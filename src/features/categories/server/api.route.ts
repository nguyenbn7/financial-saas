import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { categoryFormSchema, deletesSchema } from '$features/categories/schema';
import {
	createCategory,
	deleteCategories,
	getCategories
} from '$features/categories/server/repository';

const app = new Hono()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', async (c) => {
		const userId = c.get('userId');

		return c.json({
			categories: await getCategories({ userId })
		});
	})
	.post('/', zValidator('json', categoryFormSchema), async (c) => {
		const userId = c.get('userId');
		const { name } = c.req.valid('json');

		const result = await createCategory({ userId, name });

		const category = result.at(0);

		if (!category)
			return c.json(
				{
					error: {
						code: StatusCodes.CONFLICT,
						message: 'Cannot create category'
					}
				},
				StatusCodes.CONFLICT
			);

		return c.json({
			category
		});
	})
	.delete('/', zValidator('json', deletesSchema), async (c) => {
		const userId = c.get('userId');
		const { ids } = c.req.valid('json');

		const deletedCategoryIds = await deleteCategories({ userId, ids });

		return c.json({
			deletedCategoryIds
		});
	});

export default app;
