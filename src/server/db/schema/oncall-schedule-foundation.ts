/**
 * OCMBR Wave 6 — D11-S07 IU-SCH
 * On-call Staff Management schema
 *
 * OCMBR Reference: D11-S07-IU-SCH
 * Depends on: D04-S01 (HR)
 */

import {
  boolean,
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
// onx_oncall_schedule — on-call roster entry
// ---------------------------------------------------------------------------
export const oncallSchedule = createTable("oncall_schedule", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  staffId: text("staff_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  scheduleDate: date("schedule_date").notNull(),
  startHour: integer("start_hour").notNull(),
  endHour: integer("end_hour").notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  isPrimary: boolean("is_primary").default(true).notNull(),
  contactPhone: varchar("contact_phone", { length: 30 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_oncall_callout — actual call-out record
// ---------------------------------------------------------------------------
export const oncallCallout = createTable("oncall_callout", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").references(() => oncallSchedule.id, {
    onDelete: "set null",
  }),
  staffId: text("staff_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  calledAt: timestamp("called_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  outcome: varchar("outcome", { length: 50 }).default("PENDING").notNull(),
  // PENDING | RESPONDED | UNAVAILABLE | ESCALATED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type OncallSchedule = typeof oncallSchedule.$inferSelect;
export type NewOncallSchedule = typeof oncallSchedule.$inferInsert;
export type OncallCallout = typeof oncallCallout.$inferSelect;
export type NewOncallCallout = typeof oncallCallout.$inferInsert;
