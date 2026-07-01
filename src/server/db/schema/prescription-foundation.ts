/**
 * OCMBR Wave 2d — D09-S06 IU-SCH
 * Prescription schema
 *
 * OCMBR Reference: D09-S06-IU-SCH
 * Depends on: D09-S04 (Treatment Plan), D05-S03 (Item Batch)
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
import { item } from "./inventory-foundation";
import { itemBatch } from "./item-batch-foundation";
import { branch } from "./org-foundation";
import { treatmentPlan } from "./treatment-plan-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_prescription — medication prescription linked to a treatment plan
// ---------------------------------------------------------------------------
export const prescription = createTable("prescription", {
  id: serial("id").primaryKey(),
  prescriptionNumber: varchar("prescription_number", { length: 50 })
    .unique()
    .notNull(),
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
  prescribedBy: text("prescribed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  prescriptionDate: varchar("prescription_date", { length: 10 }).notNull(), // YYYY-MM-DD
  validUntil: varchar("valid_until", { length: 10 }), // YYYY-MM-DD
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | DISPENSED | EXPIRED | CANCELLED
  dispensedBy: text("dispensed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  dispensedAt: timestamp("dispensed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_prescription_line — individual medication/item lines on a prescription
// ---------------------------------------------------------------------------
export const prescriptionLine = createTable("prescription_line", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id")
    .notNull()
    .references(() => prescription.id, { onDelete: "cascade" }),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "restrict" }),
  batchId: integer("batch_id").references(() => itemBatch.id, {
    onDelete: "set null",
  }),
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
  unitOfMeasure: varchar("unit_of_measure", { length: 30 }),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 80 }),
  duration: varchar("duration", { length: 80 }),
  instructions: text("instructions"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Prescription = typeof prescription.$inferSelect;
export type NewPrescription = typeof prescription.$inferInsert;
export type PrescriptionLine = typeof prescriptionLine.$inferSelect;
export type NewPrescriptionLine = typeof prescriptionLine.$inferInsert;
