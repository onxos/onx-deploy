/**
 * OCMBR Wave 2f — D09-S08 IU-SCH
 * Hospitalisation / In-patient schema
 *
 * OCMBR Reference: D09-S08-IU-SCH
 * Depends on: D09-S01 (Patient Visit / Clinical)
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
import { patientVisit } from "./clinical-foundation";
import { client, pet } from "./crm-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_inpatient_admission — in-patient admission record
// ---------------------------------------------------------------------------
export const inpatientAdmission = createTable("inpatient_admission", {
  id: serial("id").primaryKey(),
  admissionNumber: varchar("admission_number", { length: 50 })
    .unique()
    .notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  visitId: integer("visit_id").references(() => patientVisit.id, {
    onDelete: "set null",
  }),
  admittingVetId: text("admitting_vet_id").references(() => user.id, {
    onDelete: "set null",
  }),
  admissionDate: varchar("admission_date", { length: 10 }).notNull(), // YYYY-MM-DD
  admissionReason: text("admission_reason").notNull(),
  wardLocation: varchar("ward_location", { length: 100 }),
  status: varchar("status", { length: 20 }).default("ADMITTED").notNull(),
  // ADMITTED | UNDER_OBSERVATION | DISCHARGED | TRANSFERRED | DECEASED
  dischargeDate: varchar("discharge_date", { length: 10 }),
  dischargeNotes: text("discharge_notes"),
  dischargedBy: text("discharged_by").references(() => user.id, {
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

// ---------------------------------------------------------------------------
// onx_inpatient_observation — daily observation / vitals log
// ---------------------------------------------------------------------------
export const inpatientObservation = createTable("inpatient_observation", {
  id: serial("id").primaryKey(),
  admissionId: integer("admission_id")
    .notNull()
    .references(() => inpatientAdmission.id, { onDelete: "cascade" }),
  observationDate: varchar("observation_date", { length: 10 }).notNull(),
  observationTime: varchar("observation_time", { length: 5 }), // HH:MM
  temperature: varchar("temperature", { length: 10 }),
  heartRate: varchar("heart_rate", { length: 10 }),
  respiratoryRate: varchar("respiratory_rate", { length: 10 }),
  bloodPressure: varchar("blood_pressure", { length: 20 }),
  weight: varchar("weight", { length: 10 }),
  generalCondition: text("general_condition"),
  recordedBy: text("recorded_by").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type InpatientAdmission = typeof inpatientAdmission.$inferSelect;
export type NewInpatientAdmission = typeof inpatientAdmission.$inferInsert;
export type InpatientObservation = typeof inpatientObservation.$inferSelect;
export type NewInpatientObservation = typeof inpatientObservation.$inferInsert;
