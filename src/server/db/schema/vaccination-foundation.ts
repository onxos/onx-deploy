/**
 * OCMBR Wave 2 — D09-S05 IU-SCH
 * Vaccination Record & Reminders schema
 *
 * OCMBR Reference: D09-S05-IU-SCH
 * Depends on: D09-S01 (Patient Registration), D07-S01 (CRM Pet)
 */

import { sql } from "drizzle-orm";
import {
  index,
  integer,
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
// onx_vaccination_record — immunisation event for a pet
// ---------------------------------------------------------------------------
export const vaccinationRecord = createTable(
  "vaccination_record",
  {
    id: serial("id").primaryKey(),
    petId: integer("pet_id")
      .notNull()
      .references(() => pet.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    vaccineName: varchar("vaccine_name", { length: 150 }).notNull(),
    vaccineType: varchar("vaccine_type", { length: 30 })
      .default("CORE")
      .notNull(),
    // CORE | NON_CORE | REQUIRED | LIFESTYLE
    batchNumber: varchar("batch_number", { length: 50 }),
    administeredDate: varchar("administered_date", { length: 10 }).notNull(),
    expiryDate: varchar("expiry_date", { length: 10 }),
    nextDueDate: varchar("next_due_date", { length: 10 }),
    administeredBy: text("administered_by").references(() => user.id, {
      onDelete: "set null",
    }),
    status: varchar("status", { length: 30 }).default("CURRENT").notNull(),
    // CURRENT | DUE_SOON | OVERDUE | EXPIRED
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_vax_pet_idx").on(table.petId),
    index("onx_vax_branch_idx").on(table.branchId),
    index("onx_vax_status_idx").on(table.status),
    index("onx_vax_due_idx").on(table.nextDueDate),
  ],
);

export type VaccinationRecord = typeof vaccinationRecord.$inferSelect;
export type NewVaccinationRecord = typeof vaccinationRecord.$inferInsert;
