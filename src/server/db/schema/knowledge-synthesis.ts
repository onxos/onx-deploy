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

export const knowledgeSynthesis = createTable(
  "knowledge_synthesis",
  {
    id: serial("id").primaryKey(),
    topic: varchar("topic", { length: 256 }).notNull(),
    synthesisType: varchar("synthesis_type", { length: 50 }).notNull(),
    summary: text("summary").notNull(),
    sourceRefs: jsonb("source_refs").$type<string[]>().default([]),
    confidence: varchar("confidence", { length: 20 }).default("medium"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_knowledge_synthesis_topic_idx").on(table.topic),
    index("onx_knowledge_synthesis_type_created_idx").on(
      table.synthesisType,
      table.createdAt,
    ),
  ],
);

export type KnowledgeSynthesis = typeof knowledgeSynthesis.$inferSelect;
