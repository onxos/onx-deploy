/**
 * OCMBR Wave 8 — D13-S02 IU-SCH
 * Performance Appraisal Cycle schema
 *
 * OCMBR Reference: D13-S02-IU-SCH
 * D13 = Human Capital Development
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

// ---------------------------------------------------------------------------
// onx_appraisal_cycle — annual / bi-annual appraisal period definition
// ---------------------------------------------------------------------------
export const appraisalCycle = createTable("appraisal_cycle", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "restrict",
  }),
  cycleName: varchar("cycle_name", { length: 255 }).notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  status: varchar("status", { length: 30 }).default("OPEN").notNull(),
  // OPEN | IN_PROGRESS | COMPLETED | ARCHIVED
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_appraisal_record — individual staff appraisal within a cycle
// ---------------------------------------------------------------------------
export const appraisalRecord = createTable("appraisal_record", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id")
    .notNull()
    .references(() => appraisalCycle.id, { onDelete: "restrict" }),
  staffId: text("staff_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  reviewerId: text("reviewer_id").references(() => user.id, {
    onDelete: "set null",
  }),
  overallRating: integer("overall_rating"),
  // 1–5
  selfAssessment: text("self_assessment"),
  reviewerComments: text("reviewer_comments"),
  status: varchar("status", { length: 30 }).default("PENDING").notNull(),
  // PENDING | IN_PROGRESS | COMPLETED | SIGNED_OFF
  completedDate: date("completed_date"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type AppraisalCycle = typeof appraisalCycle.$inferSelect;
export type NewAppraisalCycle = typeof appraisalCycle.$inferInsert;
export type AppraisalRecord = typeof appraisalRecord.$inferSelect;
export type NewAppraisalRecord = typeof appraisalRecord.$inferInsert;
