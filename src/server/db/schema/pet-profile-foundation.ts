/**
 * OCMBR Wave 2e — D07-S02 IU-SCH
 * Pet Profile & Medical Summary schema
 *
 * OCMBR Reference: D07-S02-IU-SCH
 * Depends on: D07-S01 (CRM Pet Owner / Pet)
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
// onx_pet_medical_alert — active alerts/conditions flagged on a pet's record
// ---------------------------------------------------------------------------
export const petMedicalAlert = createTable("pet_medical_alert", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "cascade" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  alertType: varchar("alert_type", { length: 50 }).notNull(),
  // ALLERGY | CHRONIC_CONDITION | DRUG_SENSITIVITY | BEHAVIOUR | OTHER
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).default("MEDIUM").notNull(),
  // LOW | MEDIUM | HIGH | CRITICAL
  isActive: integer("is_active").default(1).notNull(), // 1=active 0=resolved
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  recordedBy: text("recorded_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_pet_weight_record — longitudinal weight tracking for a pet
// ---------------------------------------------------------------------------
export const petWeightRecord = createTable("pet_weight_record", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "cascade" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  recordDate: varchar("record_date", { length: 10 }).notNull(), // YYYY-MM-DD
  weightKg: varchar("weight_kg", { length: 10 }).notNull(),
  recordedBy: text("recorded_by").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_pet_document — associated documents (consent forms, photos, referrals)
// ---------------------------------------------------------------------------
export const petDocument = createTable("pet_document", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "cascade" }),
  documentType: varchar("document_type", { length: 50 }).notNull(),
  // CONSENT | XRAY | PHOTO | REFERRAL_LETTER | LAB_RESULT | OTHER
  title: varchar("title", { length: 150 }).notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedBy: text("uploaded_by").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PetMedicalAlert = typeof petMedicalAlert.$inferSelect;
export type NewPetMedicalAlert = typeof petMedicalAlert.$inferInsert;
export type PetWeightRecord = typeof petWeightRecord.$inferSelect;
export type NewPetWeightRecord = typeof petWeightRecord.$inferInsert;
export type PetDocument = typeof petDocument.$inferSelect;
export type NewPetDocument = typeof petDocument.$inferInsert;
