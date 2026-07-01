/**
 * OCMBR Wave 4 — D10-S05 IU-SCH
 * Imaging Request Module schema
 *
 * OCMBR Reference: D10-S05-IU-SCH
 * Depends on: D09-S01 (Clinical), D09-S03 (SOAP Notes)
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
// onx_imaging_request — diagnostic imaging order
// ---------------------------------------------------------------------------
export const imagingRequest = createTable("imaging_request", {
  id: serial("id").primaryKey(),
  requestNumber: varchar("request_number", { length: 50 }).unique().notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pet.id, { onDelete: "restrict" }),
  clientId: integer("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  imagingType: varchar("imaging_type", { length: 30 }).notNull(),
  // XRAY | ULTRASOUND | CT | MRI | ENDOSCOPY | OTHER
  bodyRegion: varchar("body_region", { length: 100 }),
  urgency: varchar("urgency", { length: 20 }).default("ROUTINE").notNull(),
  // ROUTINE | URGENT | STAT
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  // PENDING | SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED
  clinicalIndication: text("clinical_indication"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  requestedById: text("requested_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  performedById: text("performed_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  reportSummary: text("report_summary"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ImagingRequest = typeof imagingRequest.$inferSelect;
export type NewImagingRequest = typeof imagingRequest.$inferInsert;
