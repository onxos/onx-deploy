/**
 * OCMBR Wave 2 — D02-S04 IU-SCH
 * Leave Management schema
 *
 * OCMBR Reference: D02-S04-IU-SCH
 * Depends on: D02-S01 (Employee Master)
 */

import { sql } from "drizzle-orm";
import {
  boolean,
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
// onx_leave_type — configurable leave categories
// ---------------------------------------------------------------------------
export const leaveType = createTable(
  "leave_type",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    maxDaysPerYear: numeric("max_days_per_year", {
      precision: 5,
      scale: 1,
    }).default("21"),
    carryOverDays: integer("carry_over_days").default(0).notNull(),
    isPaid: boolean("is_paid").default(true).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [index("onx_leave_type_code_idx").on(table.code)],
);

// ---------------------------------------------------------------------------
// onx_leave_request — employee leave application
// ---------------------------------------------------------------------------
export const leaveRequest = createTable(
  "leave_request",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employee.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    leaveTypeId: integer("leave_type_id")
      .notNull()
      .references(() => leaveType.id, { onDelete: "restrict" }),
    startDate: varchar("start_date", { length: 10 }).notNull(),
    endDate: varchar("end_date", { length: 10 }).notNull(),
    totalDays: numeric("total_days", { precision: 5, scale: 1 }).notNull(),
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
    // PENDING | APPROVED | REJECTED | CANCELLED
    reason: text("reason"),
    reviewedBy: text("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_leave_req_employee_idx").on(table.employeeId),
    index("onx_leave_req_status_idx").on(table.status),
    index("onx_leave_req_dates_idx").on(table.startDate, table.endDate),
  ],
);

export type LeaveType = typeof leaveType.$inferSelect;
export type NewLeaveType = typeof leaveType.$inferInsert;
export type LeaveRequest = typeof leaveRequest.$inferSelect;
export type NewLeaveRequest = typeof leaveRequest.$inferInsert;
