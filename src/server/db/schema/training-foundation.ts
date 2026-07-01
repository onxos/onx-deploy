/**
 * OCMBR Wave 7 — D13-S01 IU-SCH
 * Continuing Education & Training Records schema
 *
 * OCMBR Reference: D13-S01-IU-SCH
 * D13 = Human Capital Development
 */

import {
  boolean,
  date,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_training_course — catalogue of CPD / training programmes
// ---------------------------------------------------------------------------
export const trainingCourse = createTable("training_course", {
  id: serial("id").primaryKey(),
  courseCode: varchar("course_code", { length: 50 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }),
  deliveryMode: varchar("delivery_mode", { length: 30 })
    .default("IN_PERSON")
    .notNull(),
  // IN_PERSON | ONLINE | BLENDED | CONFERENCE
  cpdHours: integer("cpd_hours").default(0).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_training_record — per-staff training completion
// ---------------------------------------------------------------------------
export const trainingRecord = createTable("training_record", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => trainingCourse.id, { onDelete: "restrict" }),
  staffId: text("staff_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  completedDate: date("completed_date"),
  score: integer("score"),
  status: varchar("status", { length: 30 }).default("ENROLLED").notNull(),
  // ENROLLED | IN_PROGRESS | COMPLETED | FAILED | CANCELLED
  certificateUrl: text("certificate_url"),
  expiryDate: date("expiry_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TrainingCourse = typeof trainingCourse.$inferSelect;
export type NewTrainingCourse = typeof trainingCourse.$inferInsert;
export type TrainingRecord = typeof trainingRecord.$inferSelect;
export type NewTrainingRecord = typeof trainingRecord.$inferInsert;
