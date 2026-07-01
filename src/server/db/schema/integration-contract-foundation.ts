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

// D13-S06 Integration Contract Stubs
export const integrationContract = createTable(
  "integration_contract",
  {
    id: serial("id").primaryKey(),
    contractKey: varchar("contract_key", { length: 100 }).notNull().unique(),
    sourceDomain: varchar("source_domain", { length: 50 }).notNull(),
    targetSystem: varchar("target_system", { length: 100 }).notNull(),
    contractVersion: varchar("contract_version", { length: 20 })
      .default("1.0")
      .notNull(),
    inputSchema: jsonb("input_schema").notNull(),
    outputSchema: jsonb("output_schema").notNull(),
    status: varchar("status", { length: 30 }).default("STUB").notNull(),
    description: text("description"),
    activationCondition: text("activation_condition"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_integration_source_idx").on(table.sourceDomain),
    index("onx_integration_target_idx").on(table.targetSystem),
    index("onx_integration_status_idx").on(table.status),
  ],
);

export type IntegrationContract = typeof integrationContract.$inferSelect;
export type NewIntegrationContract = typeof integrationContract.$inferInsert;
