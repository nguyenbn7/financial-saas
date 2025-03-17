import type { InferSelectModel } from 'drizzle-orm';

import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export type User = InferSelectModel<typeof user>;
