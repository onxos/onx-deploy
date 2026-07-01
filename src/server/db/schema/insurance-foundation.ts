/**
 * OCMBR Wave 1 — D06-S01 / Insurance Foundation
 * Insurance Company Master
 *
 * IU-ID: D06-S01-IU-SCH
 * System: Insurance Company Master
 * Domain: D06 — Insurance & Claims
 * Depends on: FOUND-IU-01 (onx_branch)
 */

import { sql } from "drizzle-orm";
import {
  date,
  index,
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
// onx_insurance_company — insurance provider/payer master record
// ---------------------------------------------------------------------------
export const insuranceCompany = createTable(
  "insurance_company",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    licenseNumber: varchar("license_number", { length: 100 }).unique(),
    contactName: varchar("contact_name", { length: 150 }),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 30 }),
    address: text("address"),
    portalUrl: varchar("portal_url", { length: 500 }),
    submissionEmail: varchar("submission_email", { length: 256 }),
    status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
    contractStartDate: date("contract_start_date"),
    contractEndDate: date("contract_end_date"),
    creditDays: integer("credit_days").default(30).notNull(),
    notes: text("notes"),
    branchId: integer("branch_id").references(() => branch.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_insurance_co_code_idx").on(table.code),
    index("onx_insurance_co_status_idx").on(table.status),
    index("onx_insurance_co_branch_idx").on(table.branchId),
  ],
);

export type InsuranceCompany = typeof insuranceCompany.$inferSelect;
export type NewInsuranceCompany = typeof insuranceCompany.$inferInsert;
