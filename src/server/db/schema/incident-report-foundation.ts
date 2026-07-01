/**
 * OCMBR Wave 7 — D12-S06 IU-SCH
 * Incident Reporting schema
 *
 * OCMBR Reference: D12-S06-IU-SCH
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
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const incidentReport = createTable("incident_report", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  reportCode: varchar("report_code", { length: 50 }).unique().notNull(),
  incidentType: varchar("incident_type", { length: 100 }).notNull(),
  // NEAR_MISS | ADVERSE_EVENT | COMPLAINT | EQUIPMENT_FAILURE | SECURITY | OTHER
  severity: varchar("severity", { length: 20 }).default("LOW").notNull(),
  // LOW | MEDIUM | HIGH | CRITICAL
  description: text("description").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  reportedById: text("reported_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  status: varchar("status", { length: 30 }).default("OPEN").notNull(),
  // OPEN | UNDER_INVESTIGATION | RESOLVED | CLOSED
  investigationNotes: text("investigation_notes"),
  resolution: text("resolution"),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type IncidentReport = typeof incidentReport.$inferSelect;
export type NewIncidentReport = typeof incidentReport.$inferInsert;
