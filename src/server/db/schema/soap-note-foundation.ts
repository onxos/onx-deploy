/**
 * OCMBR Wave 2b — D09-S03 IU-SCH
 * Consultation / SOAP Note schema
 *
 * OCMBR Reference: D09-S03-IU-SCH
 * Depends on: D09-S02 (Appointment), D09-S01 (PatientVisit)
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
import { appointment } from "./appointment-foundation";
import { user } from "./auth";
import { patientVisit } from "./clinical-foundation";
import { client, pet } from "./crm-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_soap_note — SOAP consultation record linked to an appointment/visit
// ---------------------------------------------------------------------------
export const soapNote = createTable("soap_note", {
  id: serial("id").primaryKey(),
  noteNumber: varchar("note_number", { length: 50 }).unique().notNull(),
  appointmentId: integer("appointment_id").references(() => appointment.id, {
    onDelete: "set null",
  }),
  visitId: integer("visit_id").references(() => patientVisit.id, {
    onDelete: "set null",
  }),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  attendingVetId: text("attending_vet_id").references(() => user.id, {
    onDelete: "set null",
  }),
  consultationDate: varchar("consultation_date", { length: 10 }).notNull(), // YYYY-MM-DD
  // SOAP sections
  subjective: text("subjective"), // chief complaint, history
  objective: text("objective"), // physical exam findings, vitals
  assessment: text("assessment"), // diagnosis / differential
  plan: text("plan"), // treatment plan
  // Vitals (stored as numeric strings for precision)
  weightKg: numeric("weight_kg", { precision: 6, scale: 2 }),
  temperatureCelsius: numeric("temperature_celsius", {
    precision: 5,
    scale: 2,
  }),
  heartRate: integer("heart_rate"), // bpm
  respiratoryRate: integer("respiratory_rate"), // breaths/min
  status: varchar("status", { length: 20 }).default("DRAFT").notNull(),
  // DRAFT | COMPLETED | SIGNED
  signedAt: timestamp("signed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SoapNote = typeof soapNote.$inferSelect;
export type NewSoapNote = typeof soapNote.$inferInsert;
