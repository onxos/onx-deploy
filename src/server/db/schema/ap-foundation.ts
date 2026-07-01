/**
 * OCMBR Wave 2c — D03-S04 IU-SCH
 * Accounts Payable schema
 *
 * OCMBR Reference: D03-S04-IU-SCH
 * Depends on: D04-S04 (Purchase Order), D04-S01 (Vendor)
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
import { vendor } from "./procurement-foundation";
import { purchaseOrder } from "./purchase-order-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_ap_bill — vendor bill / supplier invoice
// ---------------------------------------------------------------------------
export const apBill = createTable("ap_bill", {
  id: serial("id").primaryKey(),
  billNumber: varchar("bill_number", { length: 50 }).unique().notNull(),
  vendorId: integer("vendor_id")
    .notNull()
    .references(() => vendor.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  poId: integer("po_id").references(() => purchaseOrder.id, {
    onDelete: "set null",
  }),
  accountId: integer("account_id").references(() => coaAccount.id, {
    onDelete: "set null",
  }),
  billDate: varchar("bill_date", { length: 10 }).notNull(), // YYYY-MM-DD
  dueDate: varchar("due_date", { length: 10 }).notNull(), // YYYY-MM-DD
  subtotal: numeric("subtotal", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  taxAmount: numeric("tax_amount", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  paidAmount: numeric("paid_amount", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | APPROVED | PARTIALLY_PAID | PAID | CANCELLED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_ap_payment — payment made against a vendor bill
// ---------------------------------------------------------------------------
export const apPayment = createTable("ap_payment", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id")
    .notNull()
    .references(() => apBill.id, { onDelete: "cascade" }),
  paymentDate: varchar("payment_date", { length: 10 }).notNull(), // YYYY-MM-DD
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 })
    .default("BANK_TRANSFER")
    .notNull(),
  // CASH | BANK_TRANSFER | CHEQUE | OTHER
  reference: varchar("reference", { length: 100 }),
  paidBy: text("paid_by").references(() => user.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ApBill = typeof apBill.$inferSelect;
export type NewApBill = typeof apBill.$inferInsert;
export type ApPayment = typeof apPayment.$inferSelect;
export type NewApPayment = typeof apPayment.$inferInsert;
