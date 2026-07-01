/**
 * OCMBR Wave 6 — D12-S03 IU-SCH
 * Internal Audit Programme schema
 *
 * OCMBR Reference: D12-S03-IU-SCH
 * Depends on: org-foundation (Branch)
 */

import {
  date,
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

// ---------------------------------------------------------------------------
// onx_audit_programme — recurring internal audit definition
// ---------------------------------------------------------------------------
export const auditProgramme = createTable("audit_programme", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "restrict",
  }),
  programmeName: varchar("programme_name", { length: 255 }).notNull(),
  auditArea: varchar("audit_area", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 30 }).default("ANNUAL").notNull(),
  // MONTHLY | QUARTERLY | SEMI_ANNUAL | ANNUAL | AD_HOC
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  status: varchar("status", { length: 30 }).default("ACTIVE").notNull(),
  // ACTIVE | SUSPENDED | ARCHIVED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_audit_instance — specific execution of an audit programme
// ---------------------------------------------------------------------------
export const auditInstance = createTable("audit_instance", {
  id: serial("id").primaryKey(),
  programmeId: integer("programme_id")
    .notNull()
    .references(() => auditProgramme.id, { onDelete: "restrict" }),
  plannedDate: date("planned_date").notNull(),
  conductedDate: date("conducted_date"),
  auditorId: text("auditor_id").references(() => user.id, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 30 }).default("PLANNED").notNull(),
  // PLANNED | IN_PROGRESS | COMPLETED | CANCELLED
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type AuditProgramme = typeof auditProgramme.$inferSelect;
export type NewAuditProgramme = typeof auditProgramme.$inferInsert;
export type AuditInstance = typeof auditInstance.$inferSelect;
export type NewAuditInstance = typeof auditInstance.$inferInsert;
