/**
 * OCMBR Wave 3 — D10-S01 IU-SCH
 * Lab Test Request & Result Entry schema
 *
 * OCMBR Reference: D10-S01-IU-SCH
 * Depends on: D09-S01 (Clinical), D09-S03 (SOAP Notes)
 */

import {
  integer,
  jsonb,
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
// onx_lab_test_request — a diagnostic test order with results
// ---------------------------------------------------------------------------
export const labTestRequest = createTable("lab_test_request", {
  id: serial("id").primaryKey(),
  requestNumber: varchar("request_number", { length: 50 }).unique().notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  testCode: varchar("test_code", { length: 50 }).notNull(),
  testName: varchar("test_name", { length: 200 }).notNull(),
  category: varchar("category", { length: 50 }),
  // HAEMATOLOGY | BIOCHEMISTRY | URINALYSIS | MICROBIOLOGY | PATHOLOGY | OTHER
  urgency: varchar("urgency", { length: 20 }).default("ROUTINE").notNull(),
  // ROUTINE | URGENT | STAT
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  // PENDING | COLLECTED | PROCESSING | COMPLETED | CANCELLED
  sampleType: varchar("sample_type", { length: 50 }),
  // BLOOD | URINE | FAECES | SWAB | TISSUE | OTHER
  sampleCollectedAt: timestamp("sample_collected_at", { withTimezone: true }),
  requestedById: text("requested_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  requestedAt: timestamp("requested_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  resultData: jsonb("result_data"),
  resultSummary: text("result_summary"),
  resultDate: timestamp("result_date", { withTimezone: true }),
  reviewedById: text("reviewed_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type LabTestRequest = typeof labTestRequest.$inferSelect;
export type NewLabTestRequest = typeof labTestRequest.$inferInsert;
