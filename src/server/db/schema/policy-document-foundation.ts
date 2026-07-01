/**
 * OCMBR Wave 7 — D12-S07 IU-SCH
 * Policy & Procedure Management schema
 *
 * OCMBR Reference: D12-S07-IU-SCH
 */

import {
  date,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const policyDocument = createTable("policy_document", {
  id: serial("id").primaryKey(),
  documentCode: varchar("document_code", { length: 50 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  // POLICY | PROCEDURE | GUIDELINE | SOP | FORM
  version: varchar("version", { length: 20 }).default("1.0").notNull(),
  status: varchar("status", { length: 30 }).default("DRAFT").notNull(),
  // DRAFT | UNDER_REVIEW | APPROVED | ARCHIVED | SUPERSEDED
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  approvedById: text("approved_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  effectiveDate: date("effective_date"),
  reviewDate: date("review_date"),
  content: text("content"),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PolicyDocument = typeof policyDocument.$inferSelect;
export type NewPolicyDocument = typeof policyDocument.$inferInsert;
