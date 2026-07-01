/**
 * OCMBR Wave 2 — D05-S04 IU-SCH
 * Stock In / Out / Transfer schema
 *
 * OCMBR Reference: D05-S04-IU-SCH
 * Depends on: D05-S01 (Item Master), D15-S01 (Branch)
 * Required by: D04-S05 (GRN), D05-S05 (Reorder)
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
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { item } from "./inventory-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_stock_movement — every quantity change for an item at a branch
// ---------------------------------------------------------------------------
export const stockMovement = createTable(
  "stock_movement",
  {
    id: serial("id").primaryKey(),
    movementNumber: varchar("movement_number", { length: 50 })
      .notNull()
      .unique(),
    itemId: integer("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    movementType: varchar("movement_type", { length: 30 }).notNull(),
    // IN | OUT | TRANSFER | ADJUSTMENT | OPENING
    quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
    unitCost: numeric("unit_cost", { precision: 12, scale: 4 }).default("0"),
    referenceType: varchar("reference_type", { length: 50 }),
    // GRN | SALE | ADJUSTMENT | TRANSFER | OPENING
    referenceId: integer("reference_id"),
    fromBranchId: integer("from_branch_id").references(() => branch.id, {
      onDelete: "set null",
    }),
    toBranchId: integer("to_branch_id").references(() => branch.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_stock_mvt_item_branch_idx").on(table.itemId, table.branchId),
    index("onx_stock_mvt_type_idx").on(table.movementType),
    index("onx_stock_mvt_ref_idx").on(table.referenceType, table.referenceId),
  ],
);

// ---------------------------------------------------------------------------
// onx_stock_balance — running balance per item per branch
// ---------------------------------------------------------------------------
export const stockBalance = createTable(
  "stock_balance",
  {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    quantityOnHand: numeric("quantity_on_hand", {
      precision: 12,
      scale: 3,
    }).default("0"),
    quantityReserved: numeric("quantity_reserved", {
      precision: 12,
      scale: 3,
    }).default("0"),
    lastMovementAt: timestamp("last_movement_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    unique("onx_stock_balance_item_branch_uq").on(table.itemId, table.branchId),
    index("onx_stock_balance_item_idx").on(table.itemId),
    index("onx_stock_balance_branch_idx").on(table.branchId),
  ],
);

export type StockMovement = typeof stockMovement.$inferSelect;
export type NewStockMovement = typeof stockMovement.$inferInsert;
export type StockBalance = typeof stockBalance.$inferSelect;
export type NewStockBalance = typeof stockBalance.$inferInsert;
