/**
 * OCMBR Wave 3 — D09-S10 IU-SCH
 * Clinical Outcome Tracking schema
 *
 * OCMBR Reference: D09-S10-IU-SCH
 * Depends on: D09-S01 (Clinical), D09-S04 (Treatment Plan)
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
import { treatmentPlan } from "./treatment-plan-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_clinical_outcome — records post-treatment outcome per patient episode
// ---------------------------------------------------------------------------
export const clinicalOutcome = createTable("clinical_outcome", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  treatmentPlanId: integer("treatment_plan_id").references(
    () => treatmentPlan.id,
    { onDelete: "set null" },
  ),
  outcomeDate: varchar("outcome_date", { length: 10 }).notNull(), // YYYY-MM-DD
  status: varchar("status", { length: 30 }).default("STABLE").notNull(),
  // RECOVERED | IMPROVING | STABLE | DETERIORATED | DECEASED | REFERRED
  clinicalScore: integer("clinical_score"), // 0-10 scale
  ownerFeedback: text("owner_feedback"),
  clinicianNotes: text("clinician_notes"),
  followUpDate: varchar("follow_up_date", { length: 10 }), // YYYY-MM-DD
  followUpRequired: varchar("follow_up_required", { length: 3 })
    .default("NO")
    .notNull(),
  // YES | NO
  recordedById: text("recorded_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ClinicalOutcome = typeof clinicalOutcome.$inferSelect;
export type NewClinicalOutcome = typeof clinicalOutcome.$inferInsert;
