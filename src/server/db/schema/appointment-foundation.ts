/**
 * OCMBR Wave 2 — D09-S02 IU-SCH
 * Appointment Scheduling & Waitlist schema
 *
 * OCMBR Reference: D09-S02-IU-SCH
 * Depends on: D09-S01 (Patient Registration), D07-S01 (CRM Client)
 * Required by: D09-S03 (Consultation Workflow)
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
import { client, pet } from "./crm-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_appointment — scheduled visit for a pet with a vet
// ---------------------------------------------------------------------------
export const appointment = createTable(
  "appointment",
  {
    id: serial("id").primaryKey(),
    appointmentNumber: varchar("appointment_number", { length: 50 })
      .notNull()
      .unique(),
    petId: integer("pet_id")
      .notNull()
      .references(() => pet.id, { onDelete: "restrict" }),
    clientId: integer("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    assignedVetId: text("assigned_vet_id").references(() => user.id, {
      onDelete: "set null",
    }),
    appointmentType: varchar("appointment_type", { length: 50 })
      .default("CONSULTATION")
      .notNull(),
    // CONSULTATION | VACCINATION | GROOMING | SURGERY | FOLLOW_UP | EMERGENCY
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").default(30).notNull(),
    status: varchar("status", { length: 30 }).default("SCHEDULED").notNull(),
    // SCHEDULED | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
    notes: text("notes"),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancelReason: text("cancel_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_appt_number_idx").on(table.appointmentNumber),
    index("onx_appt_pet_idx").on(table.petId),
    index("onx_appt_branch_scheduled_idx").on(
      table.branchId,
      table.scheduledAt,
    ),
    index("onx_appt_vet_idx").on(table.assignedVetId),
    index("onx_appt_status_idx").on(table.status),
  ],
);

export type Appointment = typeof appointment.$inferSelect;
export type NewAppointment = typeof appointment.$inferInsert;
