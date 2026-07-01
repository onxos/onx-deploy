/**
 * OCMBR Wave 2b — D02-S05 IU-SCH
 * Payroll Run schema
 *
 * OCMBR Reference: D02-S05-IU-SCH
 * Depends on: D02-S03 (Timesheet), D02-S04 (Leave)
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
import { user } from "./auth";
import { employee } from "./hr-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_payroll_run — a payroll processing batch for a pay period
// ---------------------------------------------------------------------------
export const payrollRun = createTable("payroll_run", {
  id: serial("id").primaryKey(),
  runNumber: varchar("run_number", { length: 50 }).unique().notNull(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  payPeriodStart: varchar("pay_period_start", { length: 10 }).notNull(), // YYYY-MM-DD
  payPeriodEnd: varchar("pay_period_end", { length: 10 }).notNull(), // YYYY-MM-DD
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | PROCESSING | APPROVED | PAID | CANCELLED
  totalGross: numeric("total_gross", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  totalDeductions: numeric("total_deductions", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  totalNet: numeric("total_net", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  processedBy: text("processed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  approvedBy: text("approved_by").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_payroll_line — individual employee payslip within a run
// ---------------------------------------------------------------------------
export const payrollLine = createTable("payroll_line", {
  id: serial("id").primaryKey(),
  runId: integer("run_id")
    .notNull()
    .references(() => payrollRun.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employee.id, { onDelete: "restrict" }),
  basicSalary: numeric("basic_salary", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  overtimePay: numeric("overtime_pay", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  allowances: numeric("allowances", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  grossPay: numeric("gross_pay", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  taxDeduction: numeric("tax_deduction", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  socialInsurance: numeric("social_insurance", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  otherDeductions: numeric("other_deductions", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  netPay: numeric("net_pay", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  regularDays: numeric("regular_days", { precision: 5, scale: 2 }).default("0"),
  overtimeHours: numeric("overtime_hours", { precision: 5, scale: 2 }).default(
    "0",
  ),
  leaveDays: numeric("leave_days", { precision: 5, scale: 2 }).default("0"),
  notes: text("notes"),
});

export type PayrollRun = typeof payrollRun.$inferSelect;
export type NewPayrollRun = typeof payrollRun.$inferInsert;
export type PayrollLine = typeof payrollLine.$inferSelect;
export type NewPayrollLine = typeof payrollLine.$inferInsert;
