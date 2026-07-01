/**
 * OCMBR Wave 2d — D04-S06 IU-SCH
 * Supplier Returns / Debit Note schema
 *
 * OCMBR Reference: D04-S06-IU-SCH
 * Depends on: D04-S05 (GRN)
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
import { grn, grnLine } from "./grn-foundation";
import { item } from "./inventory-foundation";
import { branch } from "./org-foundation";
import { vendor } from "./procurement-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_supplier_return — return of received goods back to a supplier
// ---------------------------------------------------------------------------
export const supplierReturn = createTable("supplier_return", {
  id: serial("id").primaryKey(),
  returnNumber: varchar("return_number", { length: 50 }).unique().notNull(),
  grnId: integer("grn_id")
    .notNull()
    .references(() => grn.id, { onDelete: "restrict" }),
  vendorId: integer("vendor_id")
    .notNull()
    .references(() => vendor.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  returnDate: varchar("return_date", { length: 10 }).notNull(), // YYYY-MM-DD
  reason: varchar("reason", { length: 100 }).notNull(),
  // DEFECTIVE | OVERDELIVERY | WRONG_ITEM | QUALITY_ISSUE | OTHER
  totalAmount: numeric("total_amount", {
    precision: 14,
    scale: 2,
  }).default("0"),
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | CONFIRMED | CREDITED | CANCELLED
  debitNoteReference: varchar("debit_note_reference", { length: 80 }),
  processedBy: text("processed_by").references(() => user.id, {
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
// onx_supplier_return_line — individual items being returned
// ---------------------------------------------------------------------------
export const supplierReturnLine = createTable("supplier_return_line", {
  id: serial("id").primaryKey(),
  returnId: integer("return_id")
    .notNull()
    .references(() => supplierReturn.id, { onDelete: "cascade" }),
  grnLineId: integer("grn_line_id").references(() => grnLine.id, {
    onDelete: "set null",
  }),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "restrict" }),
  returnQty: numeric("return_qty", { precision: 12, scale: 3 }).notNull(),
  unitCost: numeric("unit_cost", { precision: 12, scale: 4 }).notNull(),
  lineTotal: numeric("line_total", { precision: 14, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SupplierReturn = typeof supplierReturn.$inferSelect;
export type NewSupplierReturn = typeof supplierReturn.$inferInsert;
export type SupplierReturnLine = typeof supplierReturnLine.$inferSelect;
export type NewSupplierReturnLine = typeof supplierReturnLine.$inferInsert;
