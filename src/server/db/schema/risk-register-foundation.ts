/**
 * OCMBR Wave 7 — D12-S05 IU-SCH
 * Risk Register schema
 *
 * OCMBR Reference: D12-S05-IU-SCH
 */

import {
  date,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const riskEntry = createTable("risk_entry", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "restrict",
  }),
  riskCode: varchar("risk_code", { length: 50 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  likelihood: integer("likelihood").notNull(),
  // 1–5
  impact: integer("impact").notNull(),
  // 1–5
  riskScore: integer("risk_score").notNull(),
  // likelihood * impact
  status: varchar("status", { length: 30 }).default("OPEN").notNull(),
  // OPEN | MITIGATED | ACCEPTED | CLOSED
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  mitigationPlan: text("mitigation_plan"),
  reviewDate: date("review_date"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type RiskEntry = typeof riskEntry.$inferSelect;
export type NewRiskEntry = typeof riskEntry.$inferInsert;
