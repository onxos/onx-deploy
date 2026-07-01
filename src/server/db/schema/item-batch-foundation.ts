/**
 * OCMBR Wave 2b — D05-S03 IU-SCH
 * Item Batch / Lot Tracking schema
 *
 * OCMBR Reference: D05-S03-IU-SCH
 * Depends on: D05-S01 (Item), D05-S02 (Location)
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
import { item } from "./inventory-foundation";
import { inventoryLocation } from "./inventory-location-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_item_batch — a received batch/lot of an inventory item
// ---------------------------------------------------------------------------
export const itemBatch = createTable("item_batch", {
  id: serial("id").primaryKey(),
  batchNumber: varchar("batch_number", { length: 80 }).notNull(),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  locationId: integer("location_id").references(() => inventoryLocation.id, {
    onDelete: "set null",
  }),
  manufacturedDate: varchar("manufactured_date", { length: 10 }), // YYYY-MM-DD
  expiryDate: varchar("expiry_date", { length: 10 }), // YYYY-MM-DD
  receivedDate: varchar("received_date", { length: 10 }).notNull(), // YYYY-MM-DD
  initialQty: numeric("initial_qty", { precision: 12, scale: 3 }).notNull(),
  currentQty: numeric("current_qty", { precision: 12, scale: 3 }).notNull(),
  unitCost: numeric("unit_cost", { precision: 12, scale: 4 }).default("0"),
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | QUARANTINE | EXPIRED | DEPLETED | RECALLED
  supplierLotNumber: varchar("supplier_lot_number", { length: 80 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ItemBatch = typeof itemBatch.$inferSelect;
export type NewItemBatch = typeof itemBatch.$inferInsert;
