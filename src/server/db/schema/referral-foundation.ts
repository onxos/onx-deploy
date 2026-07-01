/**
 * OCMBR Wave 2f — D09-S09 IU-SCH
 * Referral Management schema
 *
 * OCMBR Reference: D09-S09-IU-SCH
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
import { client, pet } from "./crm-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_referral — outward or inward patient referral record
// ---------------------------------------------------------------------------
export const referral = createTable("referral", {
  id: serial("id").primaryKey(),
  referralNumber: varchar("referral_number", { length: 50 }).unique().notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  referringVetId: text("referring_vet_id").references(() => user.id, {
    onDelete: "set null",
  }),
  referralType: varchar("referral_type", { length: 20 }).default("OUTWARD"),
  // OUTWARD | INWARD
  referralDate: varchar("referral_date", { length: 10 }).notNull(), // YYYY-MM-DD
  specialistName: varchar("specialist_name", { length: 150 }),
  specialistClinic: varchar("specialist_clinic", { length: 200 }),
  speciality: varchar("speciality", { length: 100 }),
  reason: text("reason").notNull(),
  urgency: varchar("urgency", { length: 20 }).default("ROUTINE"),
  // ROUTINE | URGENT | EMERGENCY
  status: varchar("status", { length: 30 }).default("PENDING").notNull(),
  // PENDING | SENT | ACCEPTED | APPOINTMENT_BOOKED | COMPLETED | CANCELLED
  appointmentDate: varchar("appointment_date", { length: 10 }),
  outcomeNotes: text("outcome_notes"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Referral = typeof referral.$inferSelect;
export type NewReferral = typeof referral.$inferInsert;
