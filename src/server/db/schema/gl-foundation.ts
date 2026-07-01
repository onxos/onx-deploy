/**
 * OCMBR Wave 1 — D03-S02 / GL Foundation
 * General Ledger: Fiscal Period + Journal Entry + Entry Lines
 *
 * IU-ID: D03-S02-IU-SCH
 * System: General Ledger
 * Domain: D03 — Finance & Accounting
 * Depends on: D03-S01 (onx_account), FOUND-IU-01 (onx_branch)
 */

import { sql } from "drizzle-orm";
import {
  date,
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
import { coaAccount } from "./finance-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_gl_period — accounting fiscal period
// ---------------------------------------------------------------------------
export const glPeriod = createTable(
  "gl_period",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: varchar("status", { length: 20 }).default("OPEN").notNull(),
    branchId: integer("branch_id").references(() => branch.id, {
      onDelete: "set null",
    }),
    tenantId: integer("tenant_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_gl_period_branch_idx").on(table.branchId),
    index("onx_gl_period_status_idx").on(table.status),
    index("onx_gl_period_dates_idx").on(table.startDate, table.endDate),
  ],
);

// ---------------------------------------------------------------------------
// onx_gl_entry — journal entry header
// ---------------------------------------------------------------------------
export const glEntry = createTable(
  "gl_entry",
  {
    id: serial("id").primaryKey(),
    entryNumber: varchar("entry_number", { length: 50 }).notNull().unique(),
    entryType: varchar("entry_type", { length: 30 })
      .default("JOURNAL")
      .notNull(),
    periodId: integer("period_id").references(() => glPeriod.id, {
      onDelete: "restrict",
    }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    description: varchar("description", { length: 500 }).notNull(),
    totalDebit: numeric("total_debit", { precision: 15, scale: 2 })
      .default("0")
      .notNull(),
    totalCredit: numeric("total_credit", { precision: 15, scale: 2 })
      .default("0")
      .notNull(),
    status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
    postedAt: timestamp("posted_at", { withTimezone: true }),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    referenceType: varchar("reference_type", { length: 50 }),
    referenceId: varchar("reference_id", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_gl_entry_branch_idx").on(table.branchId),
    index("onx_gl_entry_period_idx").on(table.periodId),
    index("onx_gl_entry_status_idx").on(table.status),
    index("onx_gl_entry_type_idx").on(table.entryType),
  ],
);

// ---------------------------------------------------------------------------
// onx_gl_entry_line — individual debit / credit line in a journal entry
// ---------------------------------------------------------------------------
export const glEntryLine = createTable(
  "gl_entry_line",
  {
    id: serial("id").primaryKey(),
    entryId: integer("entry_id")
      .notNull()
      .references(() => glEntry.id, { onDelete: "cascade" }),
    lineNumber: integer("line_number").notNull(),
    accountId: integer("account_id")
      .notNull()
      .references(() => coaAccount.id, { onDelete: "restrict" }),
    debit: numeric("debit", { precision: 15, scale: 2 }).default("0").notNull(),
    credit: numeric("credit", { precision: 15, scale: 2 })
      .default("0")
      .notNull(),
    description: varchar("description", { length: 500 }),
    costCenter: varchar("cost_center", { length: 100 }),
    referenceId: varchar("reference_id", { length: 100 }),
    referenceType: varchar("reference_type", { length: 50 }),
  },
  (table) => [
    index("onx_gl_line_entry_idx").on(table.entryId),
    index("onx_gl_line_account_idx").on(table.accountId),
  ],
);

export type GlPeriod = typeof glPeriod.$inferSelect;
export type NewGlPeriod = typeof glPeriod.$inferInsert;
export type GlEntry = typeof glEntry.$inferSelect;
export type NewGlEntry = typeof glEntry.$inferInsert;
export type GlEntryLine = typeof glEntryLine.$inferSelect;
export type NewGlEntryLine = typeof glEntryLine.$inferInsert;
