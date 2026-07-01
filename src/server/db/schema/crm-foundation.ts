/**
 * OCMBR Wave 1 — D07-S01 / CRM Foundation
 * Pet Owner Master (Client) + Pet Profile
 *
 * IU-ID: D07-S01-IU-SCH
 * System: Pet Owner Master (CRM)
 * Domain: D07 — Loyalty, Membership & CRM
 * Depends on: FOUND-IU-01 (onx_branch)
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  date,
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
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_client — pet owner / customer record (CRM entity)
// ---------------------------------------------------------------------------
export const client = createTable(
  "client",
  {
    id: serial("id").primaryKey(),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    tenantId: integer("tenant_id"),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    displayName: varchar("display_name", { length: 200 }),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 30 }).notNull(),
    alternatePhone: varchar("alternate_phone", { length: 30 }),
    nationalId: varchar("national_id", { length: 50 }),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender", { length: 10 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 2 }).default("SA"),
    loyaltyTier: varchar("loyalty_tier", { length: 20 })
      .default("STANDARD")
      .notNull(),
    totalVisits: integer("total_visits").default(0).notNull(),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    referredById: integer("referred_by_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_client_branch_idx").on(table.branchId),
    index("onx_client_phone_idx").on(table.phone),
    index("onx_client_email_idx").on(table.email),
    index("onx_client_loyalty_idx").on(table.loyaltyTier),
    index("onx_client_active_idx").on(table.isActive),
  ],
);

// ---------------------------------------------------------------------------
// onx_pet — pet profile linked to an owner (client)
// ---------------------------------------------------------------------------
export const pet = createTable(
  "pet",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 100 }).notNull(),
    species: varchar("species", { length: 50 }).notNull(),
    breed: varchar("breed", { length: 100 }),
    color: varchar("color", { length: 100 }),
    gender: varchar("gender", { length: 10 }),
    dateOfBirth: date("date_of_birth"),
    microchipNumber: varchar("microchip_number", { length: 50 }).unique(),
    isNeutered: boolean("is_neutered").default(false).notNull(),
    weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
    notes: text("notes"),
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
    index("onx_pet_client_idx").on(table.clientId),
    index("onx_pet_branch_idx").on(table.branchId),
    index("onx_pet_species_idx").on(table.species),
    index("onx_pet_active_idx").on(table.isActive),
  ],
);

export type Client = typeof client.$inferSelect;
export type NewClient = typeof client.$inferInsert;
export type Pet = typeof pet.$inferSelect;
export type NewPet = typeof pet.$inferInsert;
