import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.$default(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.$default(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
});

export type User = typeof user.$inferSelect;
