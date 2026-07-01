/**
 * OCMBR Wave 5 — D11-S04 IU-SCH
 * Field Visit Record schema
 *
 * OCMBR Reference: D11-S04-IU-SCH
 * Depends on: D11-S03 (Mobile Clinic), D09-S01 (Clinical)
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
import { mobileClinicStop } from "./mobile-clinic-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_field_visit — clinical consultation done at a mobile clinic stop
// ---------------------------------------------------------------------------
export const fieldVisit = createTable("field_visit", {
  id: serial("id").primaryKey(),
  visitCode: varchar("visit_code", { length: 50 }).unique().notNull(),
  mobileClinicStopId: integer("mobile_clinic_stop_id").references(
    () => mobileClinicStop.id,
    { onDelete: "set null" },
  ),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  veterinarianId: text("veterinarian_id").references(() => user.id, {
    onDelete: "set null",
  }),
  visitDate: varchar("visit_date", { length: 10 }).notNull(),
  // YYYY-MM-DD
  visitLocation: varchar("visit_location", { length: 300 }),
  chiefComplaint: text("chief_complaint"),
  clinicalFindings: text("clinical_findings"),
  treatmentProvided: text("treatment_provided"),
  followUpRequired: varchar("follow_up_required", { length: 3 })
    .default("NO")
    .notNull(),
  status: varchar("status", { length: 20 }).default("COMPLETED").notNull(),
  // COMPLETED | FOLLOW_UP_REQUIRED | REFERRED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type FieldVisit = typeof fieldVisit.$inferSelect;
export type NewFieldVisit = typeof fieldVisit.$inferInsert;
