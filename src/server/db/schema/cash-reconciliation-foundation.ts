/**
 * OCMBR Wave 2e — D08-S05 IU-SCH
 * Daily Cash Reconciliation schema
 *
 * OCMBR Reference: D08-S05-IU-SCH
 * Depends on: D08-S01 (POS Terminal / Shift)
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
import { branch } from "./org-foundation";
import { posShift } from "./pos-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_cash_reconciliation — end-of-shift / end-of-day cash count vs system
// ---------------------------------------------------------------------------
export const cashReconciliation = createTable("cash_reconciliation", {
  id: serial("id").primaryKey(),
  reconciliationNumber: varchar("reconciliation_number", { length: 50 })
    .unique()
    .notNull(),
  shiftId: integer("shift_id")
    .notNull()
    .references(() => posShift.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  reconciliationDate: varchar("reconciliation_date", { length: 10 }).notNull(), // YYYY-MM-DD
  openingFloat: numeric("opening_float", { precision: 12, scale: 2 }).default(
    "0",
  ),
  systemExpected: numeric("system_expected", {
    precision: 12,
    scale: 2,
  }).notNull(),
  physicalCount: numeric("physical_count", {
    precision: 12,
    scale: 2,
  }).notNull(),
  variance: numeric("variance", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | SUBMITTED | APPROVED | QUERIED
  reconciledBy: text("reconciled_by").references(() => user.id, {
    onDelete: "set null",
  }),
  approvedBy: text("approved_by").references(() => user.id, {
    onDelete: "set null",
  }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_cash_denomination — denomination breakdown for physical count
// ---------------------------------------------------------------------------
export const cashDenomination = createTable("cash_denomination", {
  id: serial("id").primaryKey(),
  reconciliationId: integer("reconciliation_id")
    .notNull()
    .references(() => cashReconciliation.id, { onDelete: "cascade" }),
  denomination: numeric("denomination", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(0).notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type CashReconciliation = typeof cashReconciliation.$inferSelect;
export type NewCashReconciliation = typeof cashReconciliation.$inferInsert;
export type CashDenomination = typeof cashDenomination.$inferSelect;
export type NewCashDenomination = typeof cashDenomination.$inferInsert;
