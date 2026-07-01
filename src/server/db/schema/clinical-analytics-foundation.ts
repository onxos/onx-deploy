/**
 * OCMBR Wave 8 — D14-S01 IU-SCH
 * Clinical Analytics Dashboard schema
 *
 * OCMBR Reference: D14-S01-IU-SCH
 * D14 = Analytics & Reporting
 */

import {
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_clinical_metric_snapshot — monthly clinical KPI snapshot per branch
// ---------------------------------------------------------------------------
export const clinicalMetricSnapshot = createTable("clinical_metric_snapshot", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  snapshotMonth: varchar("snapshot_month", { length: 7 }).notNull(),
  // YYYY-MM
  totalConsultations: integer("total_consultations").default(0).notNull(),
  totalSurgeries: integer("total_surgeries").default(0).notNull(),
  totalEmergencies: integer("total_emergencies").default(0).notNull(),
  totalHospitalisations: integer("total_hospitalisations").default(0).notNull(),
  avgConsultationMinutes: numeric("avg_consultation_minutes", {
    precision: 6,
    scale: 2,
  }),
  readmissionRate: numeric("readmission_rate", { precision: 5, scale: 2 }),
  mortalityCount: integer("mortality_count").default(0).notNull(),
  outcomeSatisfactionScore: numeric("outcome_satisfaction_score", {
    precision: 4,
    scale: 2,
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type ClinicalMetricSnapshot = typeof clinicalMetricSnapshot.$inferSelect;
export type NewClinicalMetricSnapshot =
  typeof clinicalMetricSnapshot.$inferInsert;
