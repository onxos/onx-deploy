/**
 * OCMBR Wave 8 — D13-S04 IU-SCH
 * Staff Development Plan schema
 *
 * OCMBR Reference: D13-S04-IU-SCH
 */

import {
  date,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_development_plan — individual development plan for a staff member
// ---------------------------------------------------------------------------
export const developmentPlan = createTable("development_plan", {
  id: serial("id").primaryKey(),
  staffId: text("staff_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  managerId: text("manager_id").references(() => user.id, {
    onDelete: "set null",
  }),
  planYear: varchar("plan_year", { length: 10 }).notNull(),
  goals: text("goals").notNull(),
  developmentAreas: text("development_areas"),
  targetCompletionDate: date("target_completion_date"),
  status: varchar("status", { length: 30 }).default("DRAFT").notNull(),
  // DRAFT | ACTIVE | COMPLETED | ARCHIVED
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type DevelopmentPlan = typeof developmentPlan.$inferSelect;
export type NewDevelopmentPlan = typeof developmentPlan.$inferInsert;
