/**
 * OCMBR Wave 1 — D09-S01 / Clinical Foundation
 * Patient Visit & Registration
 *
 * IU-ID: D09-S01-IU-SCH
 * System: Patient (Pet) Registration & Medical Record
 * Domain: D09 — Clinical Operations
 * Depends on: FOUND-IU-01 (onx_branch), D07-S01 (onx_pet)
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
import { user } from "./auth";
import { pet } from "./crm-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_patient_visit — clinical visit / registration record
// ---------------------------------------------------------------------------
export const patientVisit = createTable(
  "patient_visit",
  {
    id: serial("id").primaryKey(),
    visitNumber: varchar("visit_number", { length: 30 }).notNull().unique(),
    petId: integer("pet_id")
      .notNull()
      .references(() => pet.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    visitType: varchar("visit_type", { length: 30 })
      .default("OUTPATIENT")
      .notNull(),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    checkInAt: timestamp("check_in_at", { withTimezone: true }),
    checkOutAt: timestamp("check_out_at", { withTimezone: true }),
    assignedVetId: text("assigned_vet_id").references(() => user.id, {
      onDelete: "set null",
    }),
    chiefComplaint: text("chief_complaint"),
    weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_visit_pet_idx").on(table.petId),
    index("onx_visit_branch_idx").on(table.branchId),
    index("onx_visit_status_idx").on(table.status),
    index("onx_visit_type_idx").on(table.visitType),
    index("onx_visit_vet_idx").on(table.assignedVetId),
    index("onx_visit_scheduled_idx").on(table.scheduledAt),
  ],
);

export type PatientVisit = typeof patientVisit.$inferSelect;
export type NewPatientVisit = typeof patientVisit.$inferInsert;
