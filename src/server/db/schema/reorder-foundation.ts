/**
 * OCMBR Wave 2b — D05-S05 IU-SCH
 * Reorder Point & Min/Max Inventory Levels schema
 *
 * OCMBR Reference: D05-S05-IU-SCH
 * Depends on: D05-S01 (Item), D05-S04 (Stock Balance), D04-S02 (PR)
 */

import {
  boolean,
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { item } from "./inventory-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_reorder_rule — min/max/reorder point for an item at a branch
// ---------------------------------------------------------------------------
export const reorderRule = createTable(
  "reorder_rule",
  {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    reorderPoint: numeric("reorder_point", { precision: 10, scale: 3 })
      .default("0")
      .notNull(),
    reorderQty: numeric("reorder_qty", { precision: 10, scale: 3 })
      .default("0")
      .notNull(),
    minStock: numeric("min_stock", { precision: 10, scale: 3 }).default("0"),
    maxStock: numeric("max_stock", { precision: 10, scale: 3 }),
    leadTimeDays: integer("lead_time_days").default(0),
    preferredVendorId: integer("preferred_vendor_id"),
    isActive: boolean("is_active").default(true).notNull(),
    lastTriggeredAt: timestamp("last_triggered_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("uq_reorder_item_branch").on(t.itemId, t.branchId)],
);

// ---------------------------------------------------------------------------
// onx_reorder_alert — triggered alerts when stock falls below reorder point
// ---------------------------------------------------------------------------
export const reorderAlert = createTable("reorder_alert", {
  id: serial("id").primaryKey(),
  reorderRuleId: integer("reorder_rule_id")
    .notNull()
    .references(() => reorderRule.id, { onDelete: "cascade" }),
  currentQty: numeric("current_qty", { precision: 10, scale: 3 }).notNull(),
  status: varchar("status", { length: 20 }).default("OPEN").notNull(),
  // OPEN | PR_CREATED | RESOLVED | DISMISSED
  prId: integer("pr_id"), // FK to purchaseRequisition added via migration — avoids circular import
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ReorderRule = typeof reorderRule.$inferSelect;
export type NewReorderRule = typeof reorderRule.$inferInsert;
export type ReorderAlert = typeof reorderAlert.$inferSelect;
export type NewReorderAlert = typeof reorderAlert.$inferInsert;
