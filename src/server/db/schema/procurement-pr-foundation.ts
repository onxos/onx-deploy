/**
 * OCMBR Wave 2 — D04-S02 IU-SCH
 * Purchase Requisition schema
 *
 * OCMBR Reference: D04-S02-IU-SCH
 * Depends on: D04-S01 (Vendor Master), D05-S01 (Item Master), D02-S01 (HR)
 */

import { sql } from "drizzle-orm";
import {
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
import { department } from "./hr-foundation";
import { item } from "./inventory-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_purchase_requisition — internal request to procure goods/services
// ---------------------------------------------------------------------------
export const purchaseRequisition = createTable(
  "purchase_requisition",
  {
    id: serial("id").primaryKey(),
    prNumber: varchar("pr_number", { length: 50 }).notNull().unique(),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    requestedBy: text("requested_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    departmentId: integer("department_id").references(() => department.id, {
      onDelete: "set null",
    }),
    status: varchar("status", { length: 30 }).default("DRAFT").notNull(),
    // DRAFT | PENDING_APPROVAL | APPROVED | REJECTED | CANCELLED | CONVERTED
    requiredDate: varchar("required_date", { length: 10 }),
    totalEstimatedCost: numeric("total_estimated_cost", {
      precision: 14,
      scale: 2,
    }).default("0"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_pr_number_idx").on(table.prNumber),
    index("onx_pr_branch_idx").on(table.branchId),
    index("onx_pr_status_idx").on(table.status),
    index("onx_pr_requested_by_idx").on(table.requestedBy),
  ],
);

// ---------------------------------------------------------------------------
// onx_pr_line — line items on a purchase requisition
// ---------------------------------------------------------------------------
export const prLine = createTable(
  "pr_line",
  {
    id: serial("id").primaryKey(),
    prId: integer("pr_id")
      .notNull()
      .references(() => purchaseRequisition.id, { onDelete: "cascade" }),
    lineNumber: integer("line_number").notNull(),
    itemId: integer("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "restrict" }),
    requestedQty: numeric("requested_qty", {
      precision: 12,
      scale: 3,
    }).notNull(),
    estimatedUnitPrice: numeric("estimated_unit_price", {
      precision: 12,
      scale: 2,
    }).default("0"),
    totalEstimated: numeric("total_estimated", {
      precision: 14,
      scale: 2,
    }).default("0"),
    notes: text("notes"),
  },
  (table) => [
    index("onx_pr_line_pr_idx").on(table.prId),
    index("onx_pr_line_item_idx").on(table.itemId),
  ],
);

export type PurchaseRequisition = typeof purchaseRequisition.$inferSelect;
export type NewPurchaseRequisition = typeof purchaseRequisition.$inferInsert;
export type PrLine = typeof prLine.$inferSelect;
export type NewPrLine = typeof prLine.$inferInsert;
