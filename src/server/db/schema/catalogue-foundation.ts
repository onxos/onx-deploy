/**
 * OCMBR Wave 2e — D08-S02 IU-SCH
 * Service & Product Catalogue schema
 *
 * OCMBR Reference: D08-S02-IU-SCH
 * Depends on: D05-S01 (Item Master), D08-S01 (POS Terminal)
 */

import {
  boolean,
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { item } from "./inventory-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_catalogue_category — grouping for services/products in the POS catalogue
// ---------------------------------------------------------------------------
export const catalogueCategory = createTable("catalogue_category", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  parentCategoryId: integer("parent_category_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_catalogue_entry — sellable service/product visible on POS
// ---------------------------------------------------------------------------
export const catalogueEntry = createTable("catalogue_entry", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  categoryId: integer("category_id").references(() => catalogueCategory.id, {
    onDelete: "set null",
  }),
  itemId: integer("item_id").references(() => item.id, {
    onDelete: "set null",
  }),
  sku: varchar("sku", { length: 80 }).unique(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).default("SERVICE").notNull(),
  // SERVICE | PRODUCT | BUNDLE
  basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type CatalogueCategory = typeof catalogueCategory.$inferSelect;
export type NewCatalogueCategory = typeof catalogueCategory.$inferInsert;
export type CatalogueEntry = typeof catalogueEntry.$inferSelect;
export type NewCatalogueEntry = typeof catalogueEntry.$inferInsert;
