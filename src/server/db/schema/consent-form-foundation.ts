/**
 * OCMBR Wave 3 — D09-S11 IU-SCH
 * Consent Forms & Legal Documents schema
 *
 * OCMBR Reference: D09-S11-IU-SCH
 * Depends on: D09-S01 (Clinical)
 */

import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { client, pet } from "./crm-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_consent_form — patient / owner consent record
// ---------------------------------------------------------------------------
export const consentForm = createTable("consent_form", {
  id: serial("id").primaryKey(),
  formNumber: varchar("form_number", { length: 50 }).unique().notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  formType: varchar("form_type", { length: 50 }).notNull(),
  // SURGERY | TREATMENT | VACCINATION | ANAESTHESIA | REFERRAL | GENERAL
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  // PENDING | SIGNED | DECLINED | REVOKED
  consentText: text("consent_text"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  signedByOwnerId: integer("signed_by_owner_id").references(() => client.id, {
    onDelete: "set null",
  }),
  signedByStaffId: text("signed_by_staff_id").references(() => user.id, {
    onDelete: "set null",
  }),
  documentUrl: varchar("document_url", { length: 500 }),
  notes: text("notes"),
  createdById: text("created_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ConsentForm = typeof consentForm.$inferSelect;
export type NewConsentForm = typeof consentForm.$inferInsert;
