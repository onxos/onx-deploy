/**
 * OCMBR Wave 2 — D03-S03 IU-SCH
 * Accounts Receivable schema
 *
 * OCMBR Reference: D03-S03-IU-SCH
 * Depends on: D03-S01 (Chart of Accounts), D07-S01 (CRM Client)
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
import { client } from "./crm-foundation";
import { coaAccount } from "./finance-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_ar_invoice — receivable invoice issued to a client
// ---------------------------------------------------------------------------
export const arInvoice = createTable(
  "ar_invoice",
  {
    id: serial("id").primaryKey(),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
    clientId: integer("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    accountId: integer("account_id").references(() => coaAccount.id, {
      onDelete: "set null",
    }),
    issueDate: varchar("issue_date", { length: 10 }).notNull(),
    dueDate: varchar("due_date", { length: 10 }).notNull(),
    subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 14, scale: 2 }).default("0"),
    totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
    paidAmount: numeric("paid_amount", { precision: 14, scale: 2 }).default(
      "0",
    ),
    status: varchar("status", { length: 30 }).default("DRAFT").notNull(),
    // DRAFT | ISSUED | PARTIALLY_PAID | PAID | OVERDUE | CANCELLED
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_ar_invoice_number_idx").on(table.invoiceNumber),
    index("onx_ar_invoice_client_idx").on(table.clientId),
    index("onx_ar_invoice_status_idx").on(table.status),
    index("onx_ar_invoice_due_idx").on(table.dueDate),
  ],
);

// ---------------------------------------------------------------------------
// onx_ar_payment — payment recorded against an AR invoice
// ---------------------------------------------------------------------------
export const arPayment = createTable(
  "ar_payment",
  {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => arInvoice.id, { onDelete: "cascade" }),
    paymentDate: varchar("payment_date", { length: 10 }).notNull(),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 })
      .default("CASH")
      .notNull(),
    // CASH | CARD | BANK_TRANSFER | INSURANCE | OTHER
    reference: varchar("reference", { length: 100 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_ar_payment_invoice_idx").on(table.invoiceId),
    index("onx_ar_payment_date_idx").on(table.paymentDate),
  ],
);

export type ArInvoice = typeof arInvoice.$inferSelect;
export type NewArInvoice = typeof arInvoice.$inferInsert;
export type ArPayment = typeof arPayment.$inferSelect;
export type NewArPayment = typeof arPayment.$inferInsert;
