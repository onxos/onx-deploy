/**
 * OCMBR Wave 3 — D10-S03 IU-SCH
 * External Lab Referral & Import schema
 *
 * OCMBR Reference: D10-S03-IU-SCH
 * Depends on: D10-S01 (Lab Test Request)
 */

import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { labTestRequest } from "./lab-test-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_external_lab — external diagnostic laboratory master
// ---------------------------------------------------------------------------
export const externalLab = createTable("external_lab", {
  id: serial("id").primaryKey(),
  labCode: varchar("lab_code", { length: 50 }).unique().notNull(),
  labName: varchar("lab_name", { length: 200 }).notNull(),
  contactEmail: varchar("contact_email", { length: 200 }),
  contactPhone: varchar("contact_phone", { length: 30 }),
  address: text("address"),
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | INACTIVE
  turnaroundDays: integer("turnaround_days"),
  specialties: varchar("specialties", { length: 500 }),
  accountNumber: varchar("account_number", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_external_lab_submission — submission of a lab request to external lab
// ---------------------------------------------------------------------------
export const externalLabSubmission = createTable("external_lab_submission", {
  id: serial("id").primaryKey(),
  labTestRequestId: integer("lab_test_request_id")
    .notNull()
    .references(() => labTestRequest.id, { onDelete: "restrict" }),
  externalLabId: integer("external_lab_id")
    .notNull()
    .references(() => externalLab.id, { onDelete: "restrict" }),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  externalReference: varchar("external_reference", { length: 100 }),
  expectedByDate: varchar("expected_by_date", { length: 10 }),
  status: varchar("status", { length: 20 }).default("SUBMITTED").notNull(),
  // SUBMITTED | IN_PROGRESS | RECEIVED | CANCELLED
  resultReceivedAt: timestamp("result_received_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ExternalLab = typeof externalLab.$inferSelect;
export type NewExternalLab = typeof externalLab.$inferInsert;
export type ExternalLabSubmission = typeof externalLabSubmission.$inferSelect;
export type NewExternalLabSubmission =
  typeof externalLabSubmission.$inferInsert;
