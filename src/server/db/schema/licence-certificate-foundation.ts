/**
 * OCMBR Wave 5 — D12-S02 IU-SCH
 * Licence & Certificate Tracker schema
 *
 * OCMBR Reference: D12-S02-IU-SCH
 * Depends on: D12-S01 (Regulatory Register), Foundation (hr)
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
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_licence_certificate — licence or certificate held by staff/organisation
// ---------------------------------------------------------------------------
export const licenceCertificate = createTable("licence_certificate", {
  id: serial("id").primaryKey(),
  certificateCode: varchar("certificate_code", { length: 50 })
    .unique()
    .notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  holderType: varchar("holder_type", { length: 20 }).notNull(),
  // STAFF | BRANCH | ORGANISATION
  holderId: varchar("holder_id", { length: 100 }).notNull(),
  // userId (text) or branchId (int stored as string) based on holderType
  staffId: text("staff_id").references(() => user.id, { onDelete: "set null" }),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "set null",
  }),
  issuingAuthority: varchar("issuing_authority", { length: 200 }),
  issueDate: varchar("issue_date", { length: 10 }),
  expiryDate: varchar("expiry_date", { length: 10 }),
  // YYYY-MM-DD
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | EXPIRED | SUSPENDED | REVOKED | PENDING_RENEWAL
  reminderDaysBefore: integer("reminder_days_before").default(30),
  documentUrl: varchar("document_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type LicenceCertificate = typeof licenceCertificate.$inferSelect;
export type NewLicenceCertificate = typeof licenceCertificate.$inferInsert;
