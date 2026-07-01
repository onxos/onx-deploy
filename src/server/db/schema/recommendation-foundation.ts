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

export const recommendationRule = createTable(
  "recommendation_rule",
  {
    id: serial("id").primaryKey(),
    ruleKey: varchar("rule_key", { length: 100 }).notNull().unique(),
    domain: varchar("domain", { length: 50 }).notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    triggerCondition: jsonb("trigger_condition").notNull(),
    recommendationTemplate: text("recommendation_template").notNull(),
    priority: varchar("priority", { length: 20 }).default("MEDIUM").notNull(),
    isActive: text("is_active").default("true").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_rec_rule_domain_idx").on(table.domain),
    index("onx_rec_rule_active_idx").on(table.isActive),
  ],
);

export const recommendationOutput = createTable(
  "recommendation_output",
  {
    id: serial("id").primaryKey(),
    ruleId: serial("rule_id").notNull(),
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    entityId: varchar("entity_id", { length: 255 }).notNull(),
    recommendationText: text("recommendation_text").notNull(),
    confidenceLevel: varchar("confidence_level", { length: 20 })
      .default("LOW")
      .notNull(),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
    metadata: jsonb("metadata"),
  },
  (table) => [
    index("onx_rec_output_entity_idx").on(table.entityType, table.entityId),
    index("onx_rec_output_status_idx").on(table.status),
    index("onx_rec_output_rule_idx").on(table.ruleId),
  ],
);

export type RecommendationRule = typeof recommendationRule.$inferSelect;
export type NewRecommendationRule = typeof recommendationRule.$inferInsert;
export type RecommendationOutput = typeof recommendationOutput.$inferSelect;
export type NewRecommendationOutput = typeof recommendationOutput.$inferInsert;
