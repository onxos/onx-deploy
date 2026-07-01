/**
 * OCMBR Wave 3 — D10-S02 IU-SCH
 * In-house Analyser Integration Hooks schema
 *
 * OCMBR Reference: D10-S02-IU-SCH
 * Depends on: D10-S01 (Lab Test Request)
 */

import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_analyser_device — in-house diagnostic analyser device registry
// ---------------------------------------------------------------------------
export const analyserDevice = createTable("analyser_device", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  deviceCode: varchar("device_code", { length: 50 }).unique().notNull(),
  deviceName: varchar("device_name", { length: 200 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 100 }),
  model: varchar("model", { length: 100 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  category: varchar("category", { length: 50 }),
  // HAEMATOLOGY | BIOCHEMISTRY | URINALYSIS | IMMUNOLOGY | IMAGING | OTHER
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  // ACTIVE | INACTIVE | MAINTENANCE | DECOMMISSIONED
  lastCalibrated: varchar("last_calibrated", { length: 10 }),
  // YYYY-MM-DD
  nextCalibrationDue: varchar("next_calibration_due", { length: 10 }),
  calibrationIntervalDays: integer("calibration_interval_days"),
  integrationEndpoint: varchar("integration_endpoint", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type AnalyserDevice = typeof analyserDevice.$inferSelect;
export type NewAnalyserDevice = typeof analyserDevice.$inferInsert;
