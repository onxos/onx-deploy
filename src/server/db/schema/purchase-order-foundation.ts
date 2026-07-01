/**
 * OCMBR Wave 2b — D04-S04 IU-SCH
 * Purchase Order schema
 *
 * OCMBR Reference: D04-S04-IU-SCH
 * Depends on: D04-S02 (Purchase Requisition), D04-S09 (Approval), D04-S01 (Vendor)
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
import { item } from "./inventory-foundation";
import { branch } from "./org-foundation";
import { vendor } from "./procurement-foundation";
import { purchaseRequisition } from "./procurement-pr-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_purchase_order — formal PO issued to a vendor
// ---------------------------------------------------------------------------
export const purchaseOrder = createTable("purchase_order", {
  id: serial("id").primaryKey(),
  poNumber: varchar("po_number", { length: 50 }).unique().notNull(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  vendorId: integer("vendor_id")
    .notNull()
    .references(() => vendor.id, { onDelete: "restrict" }),
  prId: integer("pr_id").references(() => purchaseRequisition.id, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | SENT | PARTIALLY_RECEIVED | RECEIVED | CANCELLED
  orderDate: varchar("order_date", { length: 10 }).notNull(), // YYYY-MM-DD
  expectedDeliveryDate: varchar("expected_delivery_date", { length: 10 }),
  subtotal: numeric("subtotal", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  taxAmount: numeric("tax_amount", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  issuedBy: text("issued_by").references(() => user.id, {
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
// onx_po_line — individual line item on a purchase order
// ---------------------------------------------------------------------------
export const poLine = createTable("po_line", {
  id: serial("id").primaryKey(),
  poId: integer("po_id")
    .notNull()
    .references(() => purchaseOrder.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "restrict" }),
  orderedQty: numeric("ordered_qty", { precision: 12, scale: 3 }).notNull(),
  receivedQty: numeric("received_qty", { precision: 12, scale: 3 })
    .default("0")
    .notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 4 })
    .default("0")
    .notNull(),
  totalPrice: numeric("total_price", { precision: 14, scale: 2 })
    .default("0")
    .notNull(),
  notes: text("notes"),
});

export type PurchaseOrder = typeof purchaseOrder.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrder.$inferInsert;
export type PoLine = typeof poLine.$inferSelect;
export type NewPoLine = typeof poLine.$inferInsert;
