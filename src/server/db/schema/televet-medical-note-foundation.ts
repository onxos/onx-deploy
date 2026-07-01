/**
 * OCMBR Wave 4 — D11-S02 IU-SCH
 * TeleVet Medical Record Integration schema
 *
 * OCMBR Reference: D11-S02-IU-SCH
 * Depends on: D11-S01 (TeleVet Session), D09-S03 (SOAP Notes)
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
import { pet } from "./crm-foundation";
import { televet_session } from "./televet-session-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_televet_medical_note — clinical note created during a TeleVet session
// ---------------------------------------------------------------------------
export const televet_medical_note = createTable("televet_medical_note", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => televet_session.id, { onDelete: "restrict" }),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  subjective: text("subjective"),
  objective: text("objective"),
  assessment: text("assessment"),
  plan: text("plan"),
  prescriptions: text("prescriptions"),
  followUpRecommendation: text("follow_up_recommendation"),
  followUpDays: integer("follow_up_days"),
  referralRequired: varchar("referral_required", { length: 3 })
    .default("NO")
    .notNull(),
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

export type TelvetMedicalNote = typeof televet_medical_note.$inferSelect;
export type NewTelvetMedicalNote = typeof televet_medical_note.$inferInsert;
