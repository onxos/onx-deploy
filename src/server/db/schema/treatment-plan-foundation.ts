/**
 * OCMBR Wave 2d — D09-S04 IU-SCH
 * Treatment Plan schema
 *
 * OCMBR Reference: D09-S04-IU-SCH
 * Depends on: D09-S03 (SOAP Note), D07-S01 (CRM Client/Pet)
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
import { branch } from "./org-foundation";
import { soapNote } from "./soap-note-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_treatment_plan — structured plan derived from a SOAP note
// ---------------------------------------------------------------------------
export const treatmentPlan = createTable("treatment_plan", {
  id: serial("id").primaryKey(),
  planNumber: varchar("plan_number", { length: 50 }).unique().notNull(),
  soapNoteId: integer("soap_note_id").references(() => soapNote.id, {
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
  vetId: text("vet_id").references(() => user.id, { onDelete: "set null" }),
  startDate: varchar("start_date", { length: 10 }).notNull(), // YYYY-MM-DD
  endDate: varchar("end_date", { length: 10 }), // YYYY-MM-DD optional
  diagnosis: text("diagnosis").notNull(),
  treatmentGoal: text("treatment_goal"),
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | COMPLETED | CANCELLED
  totalEstimatedCost: numeric("total_estimated_cost", {
    precision: 14,
    scale: 2,
  }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_treatment_plan_item — individual steps/tasks in a treatment plan
// ---------------------------------------------------------------------------
export const treatmentPlanItem = createTable("treatment_plan_item", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => treatmentPlan.id, { onDelete: "cascade" }),
  sequence: integer("sequence").default(1).notNull(),
  description: text("description").notNull(),
  scheduledDate: varchar("scheduled_date", { length: 10 }),
  estimatedCost: numeric("estimated_cost", { precision: 14, scale: 2 }).default(
    "0",
  ),
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  // PENDING | IN_PROGRESS | DONE | SKIPPED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TreatmentPlan = typeof treatmentPlan.$inferSelect;
export type NewTreatmentPlan = typeof treatmentPlan.$inferInsert;
export type TreatmentPlanItem = typeof treatmentPlanItem.$inferSelect;
export type NewTreatmentPlanItem = typeof treatmentPlanItem.$inferInsert;
