import type { AppType } from '../routes/api/[...path]/+server';

import { hc } from 'hono/client';

import { PUBLIC_API_URL } from '$env/static/public';

export const client = hc<AppType>(PUBLIC_API_URL);
