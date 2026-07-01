/**
 * OCMBR Foundation P0 — FOUND-IU-04
 * Event Outbox + Job Queue schema
 *
 * The event outbox enables reliable domain event publication for the
 * Intelligence & Automation layer (D13). Events are written
 * transactionally with the originating domain operation, then processed
 * by a background worker.
 *
 * The job queue provides async task execution (emails, reports,
 * scheduled tasks) across all domains.
 *
 * OCMBR Reference: FOUND-IU-04 (D13-S01, D13-S08)
 * Phase: Foundation P0
 * Blocks: D13 intelligence hooks across all domains
 */

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_event_outbox — transactional outbox for domain events
// Status lifecycle: PENDING → PROCESSING → DELIVERED | FAILED
// ---------------------------------------------------------------------------
export const eventOutbox = createTable(
  "event_outbox",
  {
    id: serial("id").primaryKey(),
    /** The domain that originated this event (e.g. "hr", "clinical", "pos") */
    domain: varchar("domain", { length: 50 }).notNull(),
    /** The type of aggregate that changed (e.g. "Employee", "Appointment") */
    aggregateType: varchar("aggregate_type", { length: 100 }).notNull(),
    /** The primary key of the changed aggregate */
    aggregateId: varchar("aggregate_id", { length: 255 }).notNull(),
    /** Event type / action name (e.g. "employee.created", "appointment.cancelled") */
    eventType: varchar("event_type", { length: 150 }).notNull(),
    /** Full event payload as JSON */
    payload: jsonb("payload").notNull(),
    /** Processing status */
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
    /** Number of delivery attempts */
    attempts: integer("attempts").default(0).notNull(),
    /** Optional target consumer (null = broadcast) */
    targetConsumer: varchar("target_consumer", { length: 100 }),
    /** Timestamp of last processing attempt */
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
    /** When the event was delivered successfully */
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    /** Error detail from last failed attempt */
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_event_outbox_status_idx").on(table.status),
    index("onx_event_outbox_domain_idx").on(table.domain),
    index("onx_event_outbox_event_type_idx").on(table.eventType),
    index("onx_event_outbox_aggregate_idx").on(
      table.aggregateType,
      table.aggregateId,
    ),
    index("onx_event_outbox_created_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// onx_job_queue — async background job execution queue
// Status lifecycle: QUEUED → RUNNING → COMPLETED | FAILED | DEAD_LETTER
// ---------------------------------------------------------------------------
export const jobQueue = createTable(
  "job_queue",
  {
    id: serial("id").primaryKey(),
    /** Job type identifier (e.g. "send_vaccination_reminder", "generate_payroll_report") */
    jobType: varchar("job_type", { length: 150 }).notNull(),
    /** Domain that created this job */
    domain: varchar("domain", { length: 50 }),
    /** Input payload for the job handler */
    payload: jsonb("payload"),
    /** Current job status */
    status: varchar("status", { length: 30 }).default("QUEUED").notNull(),
    /** Priority: 1 = highest, 10 = lowest */
    priority: integer("priority").default(5).notNull(),
    /** Attempt counter */
    attempts: integer("attempts").default(0).notNull(),
    /** Maximum retries before moving to DEAD_LETTER */
    maxAttempts: integer("max_attempts").default(3).notNull(),
    /** When this job should next be executed (used for retries / scheduled runs) */
    scheduledAt: timestamp("scheduled_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    /** When the job started processing */
    startedAt: timestamp("started_at", { withTimezone: true }),
    /** When the job completed successfully */
    completedAt: timestamp("completed_at", { withTimezone: true }),
    /** When the job was moved to dead letter after exhausting retries */
    failedAt: timestamp("failed_at", { withTimezone: true }),
    /** Output / result from a successful job */
    result: jsonb("result"),
    /** Error detail from last failed attempt */
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_job_queue_status_scheduled_idx").on(
      table.status,
      table.scheduledAt,
    ),
    index("onx_job_queue_job_type_idx").on(table.jobType),
    index("onx_job_queue_domain_idx").on(table.domain),
    index("onx_job_queue_priority_idx").on(table.priority),
  ],
);

export type EventOutbox = typeof eventOutbox.$inferSelect;
export type NewEventOutbox = typeof eventOutbox.$inferInsert;
export type JobQueue = typeof jobQueue.$inferSelect;
export type NewJobQueue = typeof jobQueue.$inferInsert;
