import { relations, type InferSelectModel } from 'drizzle-orm';

import { integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const accountTable = pgTable('account', {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull()
});

export const accountRelations = relations(accountTable, ({ many }) => ({
	transactions: many(transaction)
}));

export type Account = InferSelectModel<typeof accountTable>;

export const category = pgTable('category', {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull()
});

export const categoryRelations = relations(category, ({ many }) => ({
	transactions: many(transaction)
}));

export type Category = InferSelectModel<typeof category>;

export const transaction = pgTable('transaction', {
	id: serial().primaryKey(),
	amount: integer().notNull(),
	payee: text().notNull(),
	notes: text(),
	date: timestamp({ mode: 'date' }).notNull(),
	accountId: integer('account_id')
		.references(() => accountTable.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: integer('category_id').references(() => category.id, {
		onDelete: 'set null'
	})
});

export const transactionRelations = relations(transaction, ({ one }) => ({
	account: one(accountTable, {
		fields: [transaction.accountId],
		references: [accountTable.id]
	}),
	category: one(category, {
		fields: [transaction.categoryId],
		references: [category.id]
	})
}));

export type Transaction = InferSelectModel<typeof transaction>;
