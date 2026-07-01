/**
 * OCMBR Wave 4 — D10-S04 IU-SCH
 * Lab Result History & Trends schema
 *
 * OCMBR Reference: D10-S04-IU-SCH
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
import { labTestRequest } from "./lab-test-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_lab_reference_range — normal/expected value ranges per test type
// ---------------------------------------------------------------------------
export const labReferenceRange = createTable("lab_reference_range", {
  id: serial("id").primaryKey(),
  testCode: varchar("test_code", { length: 50 }).notNull(),
  testName: varchar("test_name", { length: 200 }).notNull(),
  species: varchar("species", { length: 50 }).notNull().default("ALL"),
  // ALL | CANINE | FELINE | EQUINE | BOVINE | AVIAN | EXOTIC
  unit: varchar("unit", { length: 30 }),
  lowNormal: varchar("low_normal", { length: 30 }),
  highNormal: varchar("high_normal", { length: 30 }),
  criticalLow: varchar("critical_low", { length: 30 }),
  criticalHigh: varchar("critical_high", { length: 30 }),
  notes: text("notes"),
  isActive: varchar("is_active", { length: 3 }).default("YES").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_lab_result_annotation — clinician annotation on a specific result
// ---------------------------------------------------------------------------
export const labResultAnnotation = createTable("lab_result_annotation", {
  id: serial("id").primaryKey(),
  labTestRequestId: integer("lab_test_request_id")
    .notNull()
    .references(() => labTestRequest.id, { onDelete: "cascade" }),
  annotation: text("annotation").notNull(),
  annotatedBy: varchar("annotated_by", { length: 200 }),
  annotatedAt: timestamp("annotated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type LabReferenceRange = typeof labReferenceRange.$inferSelect;
export type NewLabReferenceRange = typeof labReferenceRange.$inferInsert;
export type LabResultAnnotation = typeof labResultAnnotation.$inferSelect;
export type NewLabResultAnnotation = typeof labResultAnnotation.$inferInsert;
