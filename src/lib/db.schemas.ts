import { relations, type InferSelectModel } from 'drizzle-orm';

import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

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

export const account = pgTable('account', {
	id: serial().primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	userId: integer('user_id').notNull()
});

export const accountRelations = relations(account, ({ many }) => ({
	transactions: many(transaction)
}));

export type Account = InferSelectModel<typeof account>;

export const category = pgTable('category', {
	id: serial().primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	userId: integer('user_id').notNull()
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
		.references(() => account.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: integer('category_id').references(() => category.id, {
		onDelete: 'set null'
	})
});

export const transactionRelations = relations(transaction, ({ one }) => ({
	account: one(account, {
		fields: [transaction.accountId],
		references: [account.id]
	}),
	category: one(category, {
		fields: [transaction.categoryId],
		references: [category.id]
	})
}));

export type Transaction = InferSelectModel<typeof transaction>;
