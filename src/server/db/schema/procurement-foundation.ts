/**
 * OCMBR Wave 1 — D04-S01 / Procurement Foundation
 * Vendor Master & Qualification
 *
 * IU-ID: D04-S01-IU-SCH
 * System: Vendor Master & Qualification
 * Domain: D04 — Procurement
 * Depends on: FOUND-IU-01 (onx_branch), FOUND-IU-02 (onx_tenant)
 */

import { sql } from "drizzle-orm";
import {
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
// onx_vendor — supplier / contractor / service provider master
// ---------------------------------------------------------------------------
export const vendor = createTable(
  "vendor",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    vendorType: varchar("vendor_type", { length: 30 })
      .default("SUPPLIER")
      .notNull(),
    contactName: varchar("contact_name", { length: 150 }),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 30 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 2 }).default("SA"),
    taxNumber: varchar("tax_number", { length: 50 }),
    bankName: varchar("bank_name", { length: 100 }),
    bankIban: varchar("bank_iban", { length: 50 }),
    paymentTermsDays: integer("payment_terms_days").default(30).notNull(),
    creditLimit: numeric("credit_limit", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
    qualificationStatus: varchar("qualification_status", { length: 20 })
      .default("PENDING")
      .notNull(),
    branchId: integer("branch_id").references(() => branch.id, {
      onDelete: "set null",
    }),
    tenantId: integer("tenant_id"),
    notes: text("notes"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_vendor_code_idx").on(table.code),
    index("onx_vendor_status_idx").on(table.status),
    index("onx_vendor_qualification_idx").on(table.qualificationStatus),
    index("onx_vendor_branch_idx").on(table.branchId),
    index("onx_vendor_type_idx").on(table.vendorType),
  ],
);

export type Vendor = typeof vendor.$inferSelect;
export type NewVendor = typeof vendor.$inferInsert;
