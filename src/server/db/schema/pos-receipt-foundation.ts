/**
 * OCMBR Wave 2f — D08-S04 IU-SCH
 * Receipt & Invoice Generation schema
 *
 * OCMBR Reference: D08-S04-IU-SCH
 * Depends on: D08-S01 (POS Terminal), D07-S01 (CRM Client)
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
import { client } from "./crm-foundation";
import { branch } from "./org-foundation";
import { posShift, posTerminal } from "./pos-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_pos_receipt — POS transaction receipt
// ---------------------------------------------------------------------------
export const posReceipt = createTable("pos_receipt", {
  id: serial("id").primaryKey(),
  receiptNumber: varchar("receipt_number", { length: 50 }).unique().notNull(),
  terminalId: integer("terminal_id")
    .notNull()
    .references(() => posTerminal.id, { onDelete: "restrict" }),
  shiftId: integer("shift_id").references(() => posShift.id, {
    onDelete: "set null",
  }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  clientId: integer("client_id").references(() => client.id, {
    onDelete: "set null",
  }),
  cashierId: text("cashier_id").references(() => user.id, {
    onDelete: "set null",
  }),
  transactionDate: varchar("transaction_date", { length: 10 }).notNull(), // YYYY-MM-DD
  transactionTime: varchar("transaction_time", { length: 8 }), // HH:MM:SS
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", {
    precision: 14,
    scale: 2,
  }).default("0"),
  taxAmount: numeric("tax_amount", { precision: 14, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).default("CASH"),
  // CASH | CARD | MOBILE | MIXED
  amountTendered: numeric("amount_tendered", { precision: 14, scale: 2 }),
  changeGiven: numeric("change_given", { precision: 14, scale: 2 }).default(
    "0",
  ),
  status: varchar("status", { length: 20 }).default("COMPLETED").notNull(),
  // COMPLETED | VOIDED | REFUNDED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_pos_receipt_line — individual items on a receipt
// ---------------------------------------------------------------------------
export const posReceiptLine = createTable("pos_receipt_line", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id")
    .notNull()
    .references(() => posReceipt.id, { onDelete: "cascade" }),
  description: varchar("description", { length: 200 }).notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 3 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", {
    precision: 12,
    scale: 2,
  }).default("0"),
  lineTotal: numeric("line_total", { precision: 14, scale: 2 }).notNull(),
  catalogueEntryId: integer("catalogue_entry_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PosReceipt = typeof posReceipt.$inferSelect;
export type NewPosReceipt = typeof posReceipt.$inferInsert;
export type PosReceiptLine = typeof posReceiptLine.$inferSelect;
export type NewPosReceiptLine = typeof posReceiptLine.$inferInsert;
