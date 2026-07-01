/**
 * OCMBR Wave 2 — D06-S02 IU-SCH
 * Insurance Policy & Coverage Register schema
 *
 * OCMBR Reference: D06-S02-IU-SCH
 * Depends on: D06-S01 (Insurance Company Master), D07-S01 (CRM Client)
 * Required by: D06-S04 (Claim Submission)
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
  varchar,
} from "drizzle-orm/pg-core";
import { client, pet } from "./crm-foundation";
import { insuranceCompany } from "./insurance-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_insurance_policy — a policy covering a pet under an insurance company
// ---------------------------------------------------------------------------
export const insurancePolicy = createTable(
  "insurance_policy",
  {
    id: serial("id").primaryKey(),
    policyNumber: varchar("policy_number", { length: 100 }).notNull().unique(),
    insuranceCompanyId: integer("insurance_company_id")
      .notNull()
      .references(() => insuranceCompany.id, { onDelete: "restrict" }),
    clientId: integer("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "restrict" }),
    petId: integer("pet_id")
      .notNull()
      .references(() => pet.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    planName: varchar("plan_name", { length: 200 }),
    coverageType: varchar("coverage_type", { length: 50 })
      .default("BASIC")
      .notNull(),
    // COMPREHENSIVE | BASIC | EMERGENCY | WELLNESS
    annualLimit: numeric("annual_limit", { precision: 14, scale: 2 }),
    deductibleAmount: numeric("deductible_amount", {
      precision: 12,
      scale: 2,
    }).default("0"),
    copayPercentage: numeric("copay_percentage", {
      precision: 5,
      scale: 2,
    }).default("0"),
    startDate: varchar("start_date", { length: 10 }).notNull(),
    endDate: varchar("end_date", { length: 10 }).notNull(),
    premiumAmount: numeric("premium_amount", { precision: 12, scale: 2 }),
    premiumFrequency: varchar("premium_frequency", { length: 20 }).default(
      "MONTHLY",
    ),
    // MONTHLY | QUARTERLY | ANNUAL
    status: varchar("status", { length: 30 }).default("ACTIVE").notNull(),
    // ACTIVE | EXPIRED | CANCELLED | SUSPENDED
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_ins_policy_number_idx").on(table.policyNumber),
    index("onx_ins_policy_company_idx").on(table.insuranceCompanyId),
    index("onx_ins_policy_client_idx").on(table.clientId),
    index("onx_ins_policy_pet_idx").on(table.petId),
    index("onx_ins_policy_status_idx").on(table.status),
  ],
);

export type InsurancePolicy = typeof insurancePolicy.$inferSelect;
export type NewInsurancePolicy = typeof insurancePolicy.$inferInsert;
