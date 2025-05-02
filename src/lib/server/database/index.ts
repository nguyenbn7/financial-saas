import { env } from '$env/dynamic/private';

import postgres from 'postgres';

import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from '$lib/server/database/schema';

const { DATABASE_URL } = env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(DATABASE_URL);

const db = drizzle(client, { schema });

export default db;
