import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

// D01-S05 Strategic Objective (OKR/KPI Tracker)
export const strategicObjective = createTable(
  "strategic_objective",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    objectiveType: varchar("objective_type", { length: 30 })
      .default("OKR")
      .notNull(),
    owner: varchar("owner", { length: 255 }).notNull(),
    period: varchar("period", { length: 50 }).notNull(),
    targetValue: numeric("target_value", { precision: 18, scale: 4 }),
    currentValue: numeric("current_value", { precision: 18, scale: 4 }),
    unit: varchar("unit", { length: 50 }),
    progress: numeric("progress", { precision: 6, scale: 2 }),
    status: varchar("status", { length: 30 }).default("ON_TRACK").notNull(),
    parentId: numeric("parent_id", { precision: 10, scale: 0 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_strategic_obj_period_idx").on(table.period),
    index("onx_strategic_obj_owner_idx").on(table.owner),
    index("onx_strategic_obj_status_idx").on(table.status),
  ],
);

// D01-S06 Escalation & Decision Log
export const escalationLog = createTable(
  "escalation_log",
  {
    id: serial("id").primaryKey(),
    subject: varchar("subject", { length: 200 }).notNull(),
    description: text("description").notNull(),
    raisedBy: varchar("raised_by", { length: 255 }).notNull(),
    assignedTo: varchar("assigned_to", { length: 255 }),
    priority: varchar("priority", { length: 20 }).default("MEDIUM").notNull(),
    category: varchar("category", { length: 100 })
      .default("OPERATIONAL")
      .notNull(),
    status: varchar("status", { length: 30 }).default("OPEN").notNull(),
    resolution: text("resolution"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_escalation_status_idx").on(table.status),
    index("onx_escalation_priority_idx").on(table.priority),
    index("onx_escalation_raised_idx").on(table.raisedBy),
  ],
);

// D01-S07 Founder Seal / Ratification Engine
export const founderSeal = createTable(
  "founder_seal",
  {
    id: serial("id").primaryKey(),
    documentType: varchar("document_type", { length: 100 }).notNull(),
    documentRef: varchar("document_ref", { length: 200 }).notNull(),
    documentTitle: varchar("document_title", { length: 300 }).notNull(),
    sealedBy: varchar("sealed_by", { length: 255 }).notNull(),
    sealedAt: timestamp("sealed_at", { withTimezone: true }).notNull(),
    sealHash: varchar("seal_hash", { length: 255 }),
    status: varchar("status", { length: 30 }).default("SEALED").notNull(),
    notes: text("notes"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_founder_seal_doc_type_idx").on(table.documentType),
    index("onx_founder_seal_sealed_by_idx").on(table.sealedBy),
    index("onx_founder_seal_status_idx").on(table.status),
  ],
);

// D02-S08 Disciplinary & Grievance
export const disciplinaryCase = createTable(
  "disciplinary_case",
  {
    id: serial("id").primaryKey(),
    caseNo: varchar("case_no", { length: 50 }).notNull().unique(),
    employeeId: varchar("employee_id", { length: 255 }).notNull(),
    caseType: varchar("case_type", { length: 30 })
      .default("DISCIPLINARY")
      .notNull(),
    severity: varchar("severity", { length: 20 }).default("MINOR").notNull(),
    description: text("description").notNull(),
    raisedBy: varchar("raised_by", { length: 255 }).notNull(),
    investigatorId: varchar("investigator_id", { length: 255 }),
    outcome: text("outcome"),
    status: varchar("status", { length: 30 }).default("OPEN").notNull(),
    hearingDate: timestamp("hearing_date", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    attachments: jsonb("attachments"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_disciplinary_employee_idx").on(table.employeeId),
    index("onx_disciplinary_status_idx").on(table.status),
    index("onx_disciplinary_type_idx").on(table.caseType),
  ],
);

// D02-S09 Employee Self-Service
export const employeeSelfServiceRequest = createTable(
  "employee_self_service_request",
  {
    id: serial("id").primaryKey(),
    employeeId: varchar("employee_id", { length: 255 }).notNull(),
    requestType: varchar("request_type", { length: 100 }).notNull(),
    requestData: jsonb("request_data").notNull(),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    approvedBy: varchar("approved_by", { length: 255 }),
    rejectionReason: text("rejection_reason"),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_ess_employee_idx").on(table.employeeId),
    index("onx_ess_type_idx").on(table.requestType),
    index("onx_ess_status_idx").on(table.status),
  ],
);

export type StrategicObjective = typeof strategicObjective.$inferSelect;
export type NewStrategicObjective = typeof strategicObjective.$inferInsert;
export type EscalationLog = typeof escalationLog.$inferSelect;
export type NewEscalationLog = typeof escalationLog.$inferInsert;
export type FounderSeal = typeof founderSeal.$inferSelect;
export type NewFounderSeal = typeof founderSeal.$inferInsert;
export type DisciplinaryCase = typeof disciplinaryCase.$inferSelect;
export type NewDisciplinaryCase = typeof disciplinaryCase.$inferInsert;
export type EmployeeSelfServiceRequest =
  typeof employeeSelfServiceRequest.$inferSelect;
export type NewEmployeeSelfServiceRequest =
  typeof employeeSelfServiceRequest.$inferInsert;
