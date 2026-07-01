/**
 * OCMBR Wave 2 — D04-S09 IU-SCH
 * Procurement Approval Workflow schema
 *
 * OCMBR Reference: D04-S09-IU-SCH
 * Depends on: D04-S01 (Vendor Master)
 * Required by: D04-S04 (Purchase Order)
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
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
// onx_approval_workflow — configures who approves what, by amount + entity
// ---------------------------------------------------------------------------
export const approvalWorkflow = createTable(
  "approval_workflow",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    // PR | PO | EXPENSE | LEAVE
    approverUserId: text("approver_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    sequence: integer("sequence").default(1).notNull(),
    minAmount: numeric("min_amount", { precision: 14, scale: 2 }).default("0"),
    maxAmount: numeric("max_amount", { precision: 14, scale: 2 }),
    // null = no upper limit
    branchId: integer("branch_id").references(() => branch.id, {
      onDelete: "cascade",
    }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_approval_wf_entity_idx").on(table.entityType),
    index("onx_approval_wf_approver_idx").on(table.approverUserId),
    index("onx_approval_wf_branch_idx").on(table.branchId),
  ],
);

// ---------------------------------------------------------------------------
// onx_approval_record — individual approval decision log
// ---------------------------------------------------------------------------
export const approvalRecord = createTable(
  "approval_record",
  {
    id: serial("id").primaryKey(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: integer("entity_id").notNull(),
    workflowId: integer("workflow_id").references(() => approvalWorkflow.id, {
      onDelete: "set null",
    }),
    approverUserId: text("approver_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
    // PENDING | APPROVED | REJECTED
    comment: text("comment"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_approval_record_entity_idx").on(
      table.entityType,
      table.entityId,
    ),
    index("onx_approval_record_approver_idx").on(table.approverUserId),
    index("onx_approval_record_status_idx").on(table.status),
  ],
);

export type ApprovalWorkflow = typeof approvalWorkflow.$inferSelect;
export type NewApprovalWorkflow = typeof approvalWorkflow.$inferInsert;
export type ApprovalRecord = typeof approvalRecord.$inferSelect;
export type NewApprovalRecord = typeof approvalRecord.$inferInsert;
