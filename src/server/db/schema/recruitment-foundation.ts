/**
 * OCMBR Wave 2e — D02-S02 IU-SCH
 * Recruitment & Onboarding schema
 *
 * OCMBR Reference: D02-S02-IU-SCH
 * Depends on: D02-S01 (Employee Master)
 */

import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { department, employee } from "./hr-foundation";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_job_posting — open position advertised for a branch/department
// ---------------------------------------------------------------------------
export const jobPosting = createTable("job_posting", {
  id: serial("id").primaryKey(),
  postingNumber: varchar("posting_number", { length: 50 }).unique().notNull(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  departmentId: integer("department_id").references(() => department.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 150 }).notNull(),
  jobDescription: text("job_description"),
  requirements: text("requirements"),
  vacancyCount: integer("vacancy_count").default(1).notNull(),
  closingDate: varchar("closing_date", { length: 10 }), // YYYY-MM-DD
  status: varchar("status", { length: 20 }).default("OPEN").notNull(),
  // OPEN | CLOSED | CANCELLED | FILLED
  postedBy: text("posted_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_job_application — candidate application for a posting
// ---------------------------------------------------------------------------
export const jobApplication = createTable("job_application", {
  id: serial("id").primaryKey(),
  applicationNumber: varchar("application_number", { length: 50 })
    .unique()
    .notNull(),
  postingId: integer("posting_id")
    .notNull()
    .references(() => jobPosting.id, { onDelete: "restrict" }),
  candidateName: varchar("candidate_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: varchar("status", { length: 30 }).default("RECEIVED").notNull(),
  // RECEIVED | SCREENING | INTERVIEW | OFFER | HIRED | REJECTED | WITHDRAWN
  reviewedBy: text("reviewed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  appliedAt: timestamp("applied_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_onboarding_task — checklist items for new-hire onboarding
// ---------------------------------------------------------------------------
export const onboardingTask = createTable("onboarding_task", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employee.id, { onDelete: "cascade" }),
  taskName: varchar("task_name", { length: 150 }).notNull(),
  description: text("description"),
  dueDate: varchar("due_date", { length: 10 }), // YYYY-MM-DD
  assignedTo: text("assigned_to").references(() => user.id, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  // PENDING | IN_PROGRESS | DONE | SKIPPED
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type JobPosting = typeof jobPosting.$inferSelect;
export type NewJobPosting = typeof jobPosting.$inferInsert;
export type JobApplication = typeof jobApplication.$inferSelect;
export type NewJobApplication = typeof jobApplication.$inferInsert;
export type OnboardingTask = typeof onboardingTask.$inferSelect;
export type NewOnboardingTask = typeof onboardingTask.$inferInsert;
