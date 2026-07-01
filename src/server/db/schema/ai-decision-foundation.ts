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

export const aiDecisionRequest = createTable(
  "ai_decision_request",
  {
    id: serial("id").primaryKey(),
    decisionType: varchar("decision_type", { length: 150 }).notNull(),
    domain: varchar("domain", { length: 50 }).notNull(),
    inputData: jsonb("input_data").notNull(),
    outputData: jsonb("output_data"),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    modelVersion: varchar("model_version", { length: 50 }),
    confidenceScore: varchar("confidence_score", { length: 20 }),
    notes: text("notes"),
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("onx_ai_decision_type_idx").on(table.decisionType),
    index("onx_ai_decision_domain_idx").on(table.domain),
    index("onx_ai_decision_status_idx").on(table.status),
  ],
);

export type AiDecisionRequest = typeof aiDecisionRequest.$inferSelect;
export type NewAiDecisionRequest = typeof aiDecisionRequest.$inferInsert;
