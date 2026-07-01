/**
 * OCMBR Wave 4 — D11-S01 IU-SCH
 * TeleVet Booking & Video Session schema
 *
 * OCMBR Reference: D11-S01-IU-SCH
 * Depends on: D07-S01 (CRM), D09-S01 (Clinical)
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
// onx_televet_session — telehealth video consultation booking
// ---------------------------------------------------------------------------
export const televet_session = createTable("televet_session", {
  id: serial("id").primaryKey(),
  sessionCode: varchar("session_code", { length: 50 }).unique().notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  veterinarianId: text("veterinarian_id").references(() => user.id, {
    onDelete: "set null",
  }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  sessionType: varchar("session_type", { length: 30 })
    .default("VIDEO")
    .notNull(),
  // VIDEO | PHONE | CHAT
  status: varchar("status", { length: 20 }).default("BOOKED").notNull(),
  // BOOKED | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
  sessionUrl: varchar("session_url", { length: 500 }),
  recordingUrl: varchar("recording_url", { length: 500 }),
  chiefComplaint: text("chief_complaint"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TelvetSession = typeof televet_session.$inferSelect;
export type NewTelvetSession = typeof televet_session.$inferInsert;
