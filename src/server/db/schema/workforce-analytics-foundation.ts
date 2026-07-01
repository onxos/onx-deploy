/**
 * OCMBR Wave 8 — D13-S05 IU-SCH
 * Workforce Analytics schema
 *
 * OCMBR Reference: D13-S05-IU-SCH
 */

import {
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_workforce_snapshot — monthly workforce metrics snapshot
// ---------------------------------------------------------------------------
export const workforceSnapshot = createTable("workforce_snapshot", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "restrict",
  }),
  snapshotMonth: varchar("snapshot_month", { length: 7 }).notNull(),
  // YYYY-MM
  headcount: integer("headcount").notNull(),
  fullTimeEquivalent: numeric("full_time_equivalent", {
    precision: 8,
    scale: 2,
  }).notNull(),
  attritionRate: numeric("attrition_rate", { precision: 5, scale: 2 }),
  absenteeismRate: numeric("absenteeism_rate", { precision: 5, scale: 2 }),
  vacancyCount: integer("vacancy_count").default(0).notNull(),
  overtimeHours: numeric("overtime_hours", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type WorkforceSnapshot = typeof workforceSnapshot.$inferSelect;
export type NewWorkforceSnapshot = typeof workforceSnapshot.$inferInsert;
