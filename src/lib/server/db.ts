import type { Kyselify } from 'drizzle-orm/kysely';
import type { account, category, transaction, user } from '../db.schemas';
import type { LogConfig } from 'kysely';

import { env } from '$env/dynamic/private';

import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

const { DATABASE_URL } = env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

interface Database {
	user: Kyselify<typeof user>;
	account: Kyselify<typeof account>;
	category: Kyselify<typeof category>;
	transaction: Kyselify<typeof transaction>;
}

const log: LogConfig | undefined = import.meta.env.DEV ? ['query', 'error'] : undefined;

export const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool
	}),
	log
});
