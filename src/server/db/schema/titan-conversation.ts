import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const titanConversation = createTable(
  "titan_conversation",
  {
    id: serial("id").primaryKey(),
    sessionId: varchar("session_id", { length: 256 }).notNull(),
    titanId: varchar("titan_id", { length: 100 }).notNull(),
    userMessage: text("user_message").notNull(),
    titanResponse: text("titan_response").notNull(),
    sourceRefs: jsonb("source_refs").$type<string[]>().default([]),
    confidence: varchar("confidence", { length: 20 }).default("medium"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_titan_conversation_session_idx").on(table.sessionId),
    index("onx_titan_conversation_titan_created_idx").on(
      table.titanId,
      table.createdAt,
    ),
  ],
);

export type TitanConversation = typeof titanConversation.$inferSelect;
