import type { RequestHandler } from './$types';

import app from '$lib/server/api/route';

export const fallback: RequestHandler = async ({ request }) => app.fetch(request);
