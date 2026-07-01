/**
 * OCMBR Wave 2f — D09-S07 IU-SCH
 * Surgical Theatre Management schema
 *
 * OCMBR Reference: D09-S07-IU-SCH
 * Depends on: D09-S04 (Treatment Plan)
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
// onx_surgical_case — a theatre booking / surgery case record
// ---------------------------------------------------------------------------
export const surgicalCase = createTable("surgical_case", {
  id: serial("id").primaryKey(),
  caseNumber: varchar("case_number", { length: 50 }).unique().notNull(),
  treatmentPlanId: integer("treatment_plan_id").references(
    () => treatmentPlan.id,
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
  surgeonId: text("surgeon_id").references(() => user.id, {
    onDelete: "set null",
  }),
  theatreDate: varchar("theatre_date", { length: 10 }).notNull(), // YYYY-MM-DD
  scheduledStart: varchar("scheduled_start", { length: 5 }), // HH:MM
  scheduledEnd: varchar("scheduled_end", { length: 5 }),
  procedureName: varchar("procedure_name", { length: 200 }).notNull(),
  procedureType: varchar("procedure_type", { length: 50 }).default("ELECTIVE"),
  // ELECTIVE | EMERGENCY | DAY_PROCEDURE
  anaesthesiaType: varchar("anaesthesia_type", { length: 50 }),
  status: varchar("status", { length: 20 }).default("SCHEDULED").notNull(),
  // SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED | POSTPONED
  actualStart: timestamp("actual_start", { withTimezone: true }),
  actualEnd: timestamp("actual_end", { withTimezone: true }),
  postOpNotes: text("post_op_notes"),
  complications: text("complications"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_theatre_team_member — staff assigned to a surgical case
// ---------------------------------------------------------------------------
export const theatreTeamMember = createTable("theatre_team_member", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id")
    .notNull()
    .references(() => surgicalCase.id, { onDelete: "cascade" }),
  staffId: text("staff_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  role: varchar("role", { length: 50 }).notNull(),
  // SURGEON | ASSISTANT | ANAESTHETIST | SCRUB_NURSE | CIRCULATING_NURSE
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SurgicalCase = typeof surgicalCase.$inferSelect;
export type NewSurgicalCase = typeof surgicalCase.$inferInsert;
export type TheatreTeamMember = typeof theatreTeamMember.$inferSelect;
export type NewTheatreTeamMember = typeof theatreTeamMember.$inferInsert;
