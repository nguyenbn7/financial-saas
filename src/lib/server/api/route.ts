import { Hono } from 'hono';

import accounts from '$features/accounts/server/api.route';
import categories from '$features/categories/server/api.route';
import transactions from '$features/transactions/server/api.route';

const app = new Hono()
	.basePath('/api')
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions);

export default app;

export type AppType = typeof app;
