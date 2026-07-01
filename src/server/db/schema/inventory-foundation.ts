/**
 * OCMBR Wave 1 — D05-S01 / Inventory Foundation
 * Item Category + Item Master
 *
 * IU-ID: D05-S01-IU-SCH
 * System: Item Master & Catalogue
 * Domain: D05 — Inventory & Warehouse
 * Depends on: FOUND-IU-01 (onx_branch)
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_item_category — hierarchical item categorisation
// ---------------------------------------------------------------------------
export const itemCategory = createTable(
  "item_category",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    name: varchar("name", { length: 150 }).notNull(),
    parentId: integer("parent_id"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_item_cat_parent_idx").on(table.parentId),
    index("onx_item_cat_active_idx").on(table.isActive),
  ],
);

// ---------------------------------------------------------------------------
// onx_item — product / service / bundle item master
// ---------------------------------------------------------------------------
export const item = createTable(
  "item",
  {
    id: serial("id").primaryKey(),
    sku: varchar("sku", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    barcode: varchar("barcode", { length: 100 }).unique(),
    categoryId: integer("category_id").references(() => itemCategory.id, {
      onDelete: "set null",
    }),
    itemType: varchar("item_type", { length: 20 }).default("PRODUCT").notNull(),
    unit: varchar("unit", { length: 20 }).default("EACH").notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
    taxRate: numeric("tax_rate", { precision: 5, scale: 4 })
      .default("0.15")
      .notNull(),
    isVatExempt: boolean("is_vat_exempt").default(false).notNull(),
    requiresPrescription: boolean("requires_prescription")
      .default(false)
      .notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_item_category_idx").on(table.categoryId),
    index("onx_item_type_idx").on(table.itemType),
    index("onx_item_active_idx").on(table.isActive),
    index("onx_item_sku_idx").on(table.sku),
  ],
);

export type ItemCategory = typeof itemCategory.$inferSelect;
export type NewItemCategory = typeof itemCategory.$inferInsert;
export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;
