import { Hono } from 'hono';
import { requestId } from 'hono/request-id';

import accounts from '$features/accounts/server/router';
import categories from '$features/categories/server/router';
import transactions from '$features/transactions/server/router';
import summary from '$features/summary/server/router';

const app = new Hono()
	.use('*', requestId())
	.basePath('/api')
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions)
	.route('/summary', summary);

export default app;

export type AppType = typeof app;
