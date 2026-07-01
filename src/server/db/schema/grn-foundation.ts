/**
 * OCMBR Wave 2c — D04-S05 IU-SCH
 * Goods Received Note (GRN) schema
 *
 * OCMBR Reference: D04-S05-IU-SCH
 * Depends on: D04-S04 (Purchase Order), D05-S04 (Stock Movement)
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
import { poLine, purchaseOrder } from "./purchase-order-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_grn — goods received note (receipt of PO items)
// ---------------------------------------------------------------------------
export const grn = createTable("grn", {
  id: serial("id").primaryKey(),
  grnNumber: varchar("grn_number", { length: 50 }).unique().notNull(),
  poId: integer("po_id")
    .notNull()
    .references(() => purchaseOrder.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  receivedDate: varchar("received_date", { length: 10 }).notNull(), // YYYY-MM-DD
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | CONFIRMED | CANCELLED
  receivedBy: text("received_by").references(() => user.id, {
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
// onx_grn_line — individual line item received on a GRN
// ---------------------------------------------------------------------------
export const grnLine = createTable("grn_line", {
  id: serial("id").primaryKey(),
  grnId: integer("grn_id")
    .notNull()
    .references(() => grn.id, { onDelete: "cascade" }),
  poLineId: integer("po_line_id").references(() => poLine.id, {
    onDelete: "set null",
  }),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "restrict" }),
  orderedQty: numeric("ordered_qty", { precision: 12, scale: 3 }).notNull(),
  receivedQty: numeric("received_qty", { precision: 12, scale: 3 }).notNull(),
  rejectedQty: numeric("rejected_qty", { precision: 12, scale: 3 })
    .default("0")
    .notNull(),
  unitCost: numeric("unit_cost", { precision: 12, scale: 4 }).default("0"),
  batchNumber: varchar("batch_number", { length: 80 }),
  expiryDate: varchar("expiry_date", { length: 10 }), // YYYY-MM-DD
  notes: text("notes"),
});

export type Grn = typeof grn.$inferSelect;
export type NewGrn = typeof grn.$inferInsert;
export type GrnLine = typeof grnLine.$inferSelect;
export type NewGrnLine = typeof grnLine.$inferInsert;
