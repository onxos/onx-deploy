/**
 * OCMBR Wave 5 — D12-S01 IU-SCH
 * Regulatory Register schema
 *
 * OCMBR Reference: D12-S01-IU-SCH
 * Depends on: Foundation (org, branch)
 */

import {
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_regulatory_requirement — a regulatory obligation the organisation must meet
// ---------------------------------------------------------------------------
export const regulatoryRequirement = createTable("regulatory_requirement", {
  id: serial("id").primaryKey(),
  requirementCode: varchar("requirement_code", { length: 50 })
    .unique()
    .notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  regulatoryBody: varchar("regulatory_body", { length: 200 }),
  jurisdiction: varchar("jurisdiction", { length: 100 }),
  category: varchar("category", { length: 50 }),
  // LICENSING | ANIMAL_WELFARE | DATA_PRIVACY | HEALTH_SAFETY | FINANCIAL | OTHER
  complianceFrequency: varchar("compliance_frequency", { length: 30 }),
  // ANNUAL | BIENNIAL | QUARTERLY | MONTHLY | ONCE | ONGOING
  dueDate: varchar("due_date", { length: 10 }),
  // YYYY-MM-DD
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | COMPLIANT | NON_COMPLIANT | WAIVED | SUPERSEDED
  riskLevel: varchar("risk_level", { length: 10 }).default("MEDIUM").notNull(),
  // CRITICAL | HIGH | MEDIUM | LOW
  referenceUrl: varchar("reference_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type RegulatoryRequirement = typeof regulatoryRequirement.$inferSelect;
export type NewRegulatoryRequirement =
  typeof regulatoryRequirement.$inferInsert;
