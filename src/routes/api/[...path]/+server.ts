import type { RequestHandler } from './$types';

import { Hono } from 'hono';

import accounts from '$features/accounts/server/route.server';
import categories from '$features/categories/server/route.server';

const app = new Hono()
	.basePath('/api')
	.route('/accounts', accounts)
	.route('/categories', categories);

export const fallback: RequestHandler = async ({ request }) => app.fetch(request);

export type AppType = typeof app;
