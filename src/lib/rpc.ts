import type { AppType } from '$lib/server/api/route';
import { PUBLIC_API_URL } from '$env/static/public';
import { hc } from 'hono/client';

export const client = hc<AppType>(PUBLIC_API_URL);
