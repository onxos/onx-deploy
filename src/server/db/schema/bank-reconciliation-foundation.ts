/**
 * OCMBR Wave 2d — D03-S05 IU-SCH
 * Bank Reconciliation schema
 *
 * OCMBR Reference: D03-S05-IU-SCH
 * Depends on: D03-S03 (AR), D03-S04 (AP)
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
import { coaAccount } from "./finance-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_bank_reconciliation — period reconciliation of a bank/cash account
// ---------------------------------------------------------------------------
export const bankReconciliation = createTable("bank_reconciliation", {
  id: serial("id").primaryKey(),
  reconciliationNumber: varchar("reconciliation_number", {
    length: 50,
  })
    .unique()
    .notNull(),
  accountId: integer("account_id")
    .notNull()
    .references(() => coaAccount.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  statementDate: varchar("statement_date", { length: 10 }).notNull(), // YYYY-MM-DD
  openingBalance: numeric("opening_balance", {
    precision: 14,
    scale: 2,
  }).notNull(),
  closingBalance: numeric("closing_balance", {
    precision: 14,
    scale: 2,
  }).notNull(),
  reconciledBalance: numeric("reconciled_balance", {
    precision: 14,
    scale: 2,
  }).default("0"),
  variance: numeric("variance", { precision: 14, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | IN_PROGRESS | RECONCILED | CANCELLED
  reconciledBy: text("reconciled_by").references(() => user.id, {
    onDelete: "set null",
  }),
  reconciledAt: timestamp("reconciled_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_bank_reconciliation_line — individual matched transaction lines
// ---------------------------------------------------------------------------
export const bankReconciliationLine = createTable("bank_reconciliation_line", {
  id: serial("id").primaryKey(),
  reconciliationId: integer("reconciliation_id")
    .notNull()
    .references(() => bankReconciliation.id, { onDelete: "cascade" }),
  transactionDate: varchar("transaction_date", { length: 10 }).notNull(),
  description: text("description").notNull(),
  debit: numeric("debit", { precision: 14, scale: 2 }).default("0"),
  credit: numeric("credit", { precision: 14, scale: 2 }).default("0"),
  referenceType: varchar("reference_type", { length: 30 }),
  // AR_PAYMENT | AP_PAYMENT | MANUAL
  referenceId: integer("reference_id"),
  isMatched: integer("is_matched").default(0).notNull(), // 0=no 1=yes (bool)
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type BankReconciliation = typeof bankReconciliation.$inferSelect;
export type NewBankReconciliation = typeof bankReconciliation.$inferInsert;
export type BankReconciliationLine = typeof bankReconciliationLine.$inferSelect;
export type NewBankReconciliationLine =
  typeof bankReconciliationLine.$inferInsert;
