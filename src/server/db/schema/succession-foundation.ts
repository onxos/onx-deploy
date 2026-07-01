/**
 * OCMBR Wave 8 — D13-S03 IU-SCH
 * Succession Planning schema
 *
 * OCMBR Reference: D13-S03-IU-SCH
 */

import {
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

// ---------------------------------------------------------------------------
// onx_succession_plan — key role succession plan
// ---------------------------------------------------------------------------
export const successionPlan = createTable("succession_plan", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "restrict",
  }),
  roleName: varchar("role_name", { length: 255 }).notNull(),
  currentHolderId: text("current_holder_id").references(() => user.id, {
    onDelete: "set null",
  }),
  readinessLevel: varchar("readiness_level", { length: 20 })
    .default("NOT_READY")
    .notNull(),
  // READY_NOW | READY_1_YEAR | READY_2_YEARS | NOT_READY
  status: varchar("status", { length: 30 }).default("ACTIVE").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_succession_candidate — candidate for a succession plan
// ---------------------------------------------------------------------------
export const successionCandidate = createTable("succession_candidate", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => successionPlan.id, { onDelete: "restrict" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  readiness: varchar("readiness", { length: 20 })
    .default("NOT_READY")
    .notNull(),
  developmentActions: text("development_actions"),
  priority: integer("priority").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SuccessionPlan = typeof successionPlan.$inferSelect;
export type NewSuccessionPlan = typeof successionPlan.$inferInsert;
export type SuccessionCandidate = typeof successionCandidate.$inferSelect;
export type NewSuccessionCandidate = typeof successionCandidate.$inferInsert;
