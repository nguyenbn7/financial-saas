import { relations, type InferSelectModel } from 'drizzle-orm';

import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const accountTable = pgTable('account', {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull()
});

export const accountRelations = relations(accountTable, ({ many }) => ({
	transactions: many(transactionTable)
}));

export type Account = InferSelectModel<typeof accountTable>;

export const categoryTable = pgTable('category', {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull()
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
	transactions: many(transactionTable)
}));

export type Category = InferSelectModel<typeof categoryTable>;

export const transactionTable = pgTable('transaction', {
	id: uuid().primaryKey().defaultRandom(),
	amount: integer().notNull(),
	payee: text().notNull(),
	notes: text(),
	date: timestamp({ mode: 'date' }).notNull(),
	accountId: uuid('account_id')
		.references(() => accountTable.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: uuid('category_id').references(() => categoryTable.id, {
		onDelete: 'set null'
	})
});

export const transactionRelations = relations(transactionTable, ({ one }) => ({
	account: one(accountTable, {
		fields: [transactionTable.accountId],
		references: [accountTable.id]
	}),
	category: one(categoryTable, {
		fields: [transactionTable.categoryId],
		references: [categoryTable.id]
	})
}));

export type Transaction = InferSelectModel<typeof transactionTable>;
