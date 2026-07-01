/**
 * OCMBR Wave 5 — D11-S05 IU-SCH
 * Emergency Case Intake & Triage schema
 *
 * OCMBR Reference: D11-S05-IU-SCH
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
// onx_emergency_case — emergency intake and triage record
// ---------------------------------------------------------------------------
export const emergencyCase = createTable("emergency_case", {
  id: serial("id").primaryKey(),
  caseNumber: varchar("case_number", { length: 50 }).unique().notNull(),
  petId: integer("pet_id").references(() => pet.id, { onDelete: "set null" }),
  clientId: integer("client_id").references(() => client.id, {
    onDelete: "set null",
  }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  triageLevel: varchar("triage_level", { length: 20 }).notNull(),
  // CRITICAL | URGENT | SEMI_URGENT | NON_URGENT | DECEASED_ON_ARRIVAL
  presentingProblem: text("presenting_problem").notNull(),
  arrivalMode: varchar("arrival_mode", { length: 30 }),
  // WALK_IN | AMBULANCE | OWNER_VEHICLE | REFERRAL
  arrivalAt: timestamp("arrival_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  triageCompletedAt: timestamp("triage_completed_at", { withTimezone: true }),
  triageById: text("triage_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  assignedVetId: text("assigned_vet_id").references(() => user.id, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 20 }).default("TRIAGING").notNull(),
  // TRIAGING | WAITING | IN_TREATMENT | ADMITTED | DISCHARGED | DECEASED | TRANSFERRED
  disposition: varchar("disposition", { length: 50 }),
  // ADMITTED | DISCHARGED_HOME | TRANSFERRED | EUTHANISED | DECEASED
  dischargedAt: timestamp("discharged_at", { withTimezone: true }),
  clinicalNotes: text("clinical_notes"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type EmergencyCase = typeof emergencyCase.$inferSelect;
export type NewEmergencyCase = typeof emergencyCase.$inferInsert;
