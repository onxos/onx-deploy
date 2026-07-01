/**
 * OCMBR Wave 2 — D02-S03 IU-SCH
 * Attendance & Timesheet schema
 *
 * OCMBR Reference: D02-S03-IU-SCH
 * Depends on: D02-S01 (Employee Master)
 */

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { employee } from "./hr-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_timesheet_entry — daily attendance and hours record per employee
// ---------------------------------------------------------------------------
export const timesheetEntry = createTable(
  "timesheet_entry",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employee.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    entryDate: varchar("entry_date", { length: 10 }).notNull(), // ISO date YYYY-MM-DD
    clockIn: timestamp("clock_in", { withTimezone: true }),
    clockOut: timestamp("clock_out", { withTimezone: true }),
    breakMinutes: integer("break_minutes").default(0).notNull(),
    overtimeMinutes: integer("overtime_minutes").default(0).notNull(),
    regularHours: numeric("regular_hours", { precision: 5, scale: 2 }),
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
    // PENDING | APPROVED | REJECTED
    approvedBy: text("approved_by").references(() => user.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_timesheet_employee_date_idx").on(
      table.employeeId,
      table.entryDate,
    ),
    index("onx_timesheet_branch_date_idx").on(table.branchId, table.entryDate),
    index("onx_timesheet_status_idx").on(table.status),
  ],
);

export type TimesheetEntry = typeof timesheetEntry.$inferSelect;
export type NewTimesheetEntry = typeof timesheetEntry.$inferInsert;
