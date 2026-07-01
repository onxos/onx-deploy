/**
 * OCMBR Wave 2b — D05-S02 IU-SCH
 * Inventory Location schema (warehouse / shelf management)
 *
 * OCMBR Reference: D05-S02-IU-SCH
 * Depends on: D05-S01 (Item), FOUND-IU-01 (Branch)
 */

import {
  boolean,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_inventory_location — physical location (shelf/bin/zone) in a branch
// ---------------------------------------------------------------------------
export const inventoryLocation = createTable("inventory_location", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  code: varchar("code", { length: 30 }).notNull(), // e.g. "SHELF-A1", "COLD-02"
  name: varchar("name", { length: 100 }).notNull(),
  locationType: varchar("location_type", { length: 30 })
    .default("SHELF")
    .notNull(),
  // SHELF | COLD | CONTROLLED | QUARANTINE | RETURNS
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type InventoryLocation = typeof inventoryLocation.$inferSelect;
export type NewInventoryLocation = typeof inventoryLocation.$inferInsert;
