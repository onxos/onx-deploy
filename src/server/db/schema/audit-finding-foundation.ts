/**
 * OCMBR Wave 6 — D12-S04 IU-SCH
 * Audit Finding & CAPA schema
 *
 * OCMBR Reference: D12-S04-IU-SCH
 * Depends on: D12-S03 (Audit Programme)
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
import { auditInstance } from "./audit-programme-foundation";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_audit_finding — individual finding from an audit instance
// ---------------------------------------------------------------------------
export const auditFinding = createTable("audit_finding", {
  id: serial("id").primaryKey(),
  auditInstanceId: integer("audit_instance_id")
    .notNull()
    .references(() => auditInstance.id, { onDelete: "restrict" }),
  findingCode: varchar("finding_code", { length: 50 }).unique().notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).default("MINOR").notNull(),
  // CRITICAL | MAJOR | MINOR | OBSERVATION
  status: varchar("status", { length: 30 }).default("OPEN").notNull(),
  // OPEN | UNDER_REVIEW | CLOSED | DEFERRED
  dueDate: date("due_date"),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_capa — corrective and preventive action for an audit finding
// ---------------------------------------------------------------------------
export const capa = createTable("capa", {
  id: serial("id").primaryKey(),
  findingId: integer("finding_id")
    .notNull()
    .references(() => auditFinding.id, { onDelete: "restrict" }),
  capaType: varchar("capa_type", { length: 20 })
    .default("CORRECTIVE")
    .notNull(),
  // CORRECTIVE | PREVENTIVE
  description: text("description").notNull(),
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  targetDate: date("target_date").notNull(),
  completedDate: date("completed_date"),
  status: varchar("status", { length: 30 }).default("OPEN").notNull(),
  // OPEN | IN_PROGRESS | COMPLETED | OVERDUE | CANCELLED
  verificationEvidence: text("verification_evidence"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type AuditFinding = typeof auditFinding.$inferSelect;
export type NewAuditFinding = typeof auditFinding.$inferInsert;
export type Capa = typeof capa.$inferSelect;
export type NewCapa = typeof capa.$inferInsert;
