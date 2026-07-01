/**
 * OCMBR Foundation P0 — FOUND-IU-01
 * Branch / Brand schema
 *
 * These two tables are the structural foundation for all multi-branch,
 * multi-brand domain records. Every subsequent domain table that needs
 * branch scoping will carry a `branch_id` FK referencing `onx_branch`.
 *
 * OCMBR Reference: FOUND-IU-01 (D15-S01, D15-S02)
 * Phase: Foundation P0
 * Blocks: All domain records requiring branch_id or brand_id FK
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_brand — top-level brand entity (e.g. "ONX Vets", "PetCare Plus")
// ---------------------------------------------------------------------------
export const brand = createTable(
  "brand",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    logoUrl: text("logo_url"),
    primaryColor: varchar("primary_color", { length: 10 }),
    website: text("website"),
    isActive: boolean("is_active").default(true).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [index("onx_brand_code_idx").on(table.code)],
);

// ---------------------------------------------------------------------------
// onx_branch — operational location belonging to a brand
// ---------------------------------------------------------------------------
export const branch = createTable(
  "branch",
  {
    id: serial("id").primaryKey(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brand.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 150 }).notNull(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    stateProvince: varchar("state_province", { length: 100 }),
    country: varchar("country", { length: 2 }).default("SA"),
    postalCode: varchar("postal_code", { length: 20 }),
    phone: varchar("phone", { length: 30 }),
    email: varchar("email", { length: 256 }),
    timezone: varchar("timezone", { length: 60 }).default("Asia/Riyadh"),
    currency: varchar("currency", { length: 3 }).default("SAR"),
    isActive: boolean("is_active").default(true).notNull(),
    isHeadquarters: boolean("is_headquarters").default(false).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_branch_brand_id_idx").on(table.brandId),
    index("onx_branch_code_idx").on(table.code),
    index("onx_branch_active_idx").on(table.isActive),
  ],
);

export type Brand = typeof brand.$inferSelect;
export type NewBrand = typeof brand.$inferInsert;
export type Branch = typeof branch.$inferSelect;
export type NewBranch = typeof branch.$inferInsert;
