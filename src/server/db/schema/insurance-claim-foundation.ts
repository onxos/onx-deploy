/**
 * OCMBR Wave 2c — D06-S04 IU-SCH
 * Insurance Claim schema
 *
 * OCMBR Reference: D06-S04-IU-SCH
 * Depends on: D06-S02 (Insurance Policy), D09-S03 (SOAP Note)
 */

import {
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { client, pet } from "./crm-foundation";
import { insurancePolicy } from "./insurance-policy-foundation";
import { branch } from "./org-foundation";
import { soapNote } from "./soap-note-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_insurance_claim — claim filed against an insurance policy
// ---------------------------------------------------------------------------
export const insuranceClaim = createTable("insurance_claim", {
  id: serial("id").primaryKey(),
  claimNumber: varchar("claim_number", { length: 50 }).unique().notNull(),
  policyId: integer("policy_id")
    .notNull()
    .references(() => insurancePolicy.id, { onDelete: "restrict" }),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  soapNoteId: integer("soap_note_id").references(() => soapNote.id, {
    onDelete: "set null",
  }),
  claimDate: varchar("claim_date", { length: 10 }).notNull(), // YYYY-MM-DD
  diagnosis: text("diagnosis"),
  treatmentDescription: text("treatment_description"),
  totalBilled: numeric("total_billed", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  deductibleApplied: numeric("deductible_applied", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  copayAmount: numeric("copay_amount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  approvedAmount: numeric("approved_amount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  status: varchar("status", { length: 20 }).default("SUBMITTED").notNull(),
  // SUBMITTED | UNDER_REVIEW | APPROVED | PARTIALLY_PAID | PAID | REJECTED | WITHDRAWN
  insurerReference: varchar("insurer_reference", { length: 100 }),
  reviewedBy: text("reviewed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type InsuranceClaim = typeof insuranceClaim.$inferSelect;
export type NewInsuranceClaim = typeof insuranceClaim.$inferInsert;
