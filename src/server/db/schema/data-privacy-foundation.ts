/**
 * OCMBR Wave 7 — D12-S08 IU-SCH
 * Data Protection & Privacy Register schema
 *
 * OCMBR Reference: D12-S08-IU-SCH
 */

import {
  boolean,
  date,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const dataProcessingActivity = createTable("data_processing_activity", {
  id: serial("id").primaryKey(),
  activityCode: varchar("activity_code", { length: 50 }).unique().notNull(),
  activityName: varchar("activity_name", { length: 255 }).notNull(),
  purpose: text("purpose").notNull(),
  legalBasis: varchar("legal_basis", { length: 100 }).notNull(),
  // CONSENT | CONTRACT | LEGAL_OBLIGATION | VITAL_INTEREST | PUBLIC_TASK | LEGITIMATE_INTEREST
  dataCategories: text("data_categories").notNull(),
  retentionPeriod: varchar("retention_period", { length: 50 }).notNull(),
  thirdPartySharing: boolean("third_party_sharing").default(false).notNull(),
  thirdPartyDetails: text("third_party_details"),
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  riskLevel: varchar("risk_level", { length: 20 }).default("LOW").notNull(),
  // LOW | MEDIUM | HIGH
  dpiaRequired: boolean("dpia_required").default(false).notNull(),
  dpiaCompletedDate: date("dpia_completed_date"),
  status: varchar("status", { length: 30 }).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type DataProcessingActivity = typeof dataProcessingActivity.$inferSelect;
export type NewDataProcessingActivity =
  typeof dataProcessingActivity.$inferInsert;
