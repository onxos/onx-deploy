/**
 * OCMBR Foundation P0 — FOUND-IU-04 Service Layer
 * Event Outbox Service: reliable domain event publication
 *
 * Usage pattern:
 *   import { publishEvent } from "@/server/services/event-outbox.service";
 *   await publishEvent("hr", "Employee", employee.id, "employee.created", payload);
 *
 * The outbox processor (background job) picks up PENDING events and
 * delivers them to registered consumers. For Foundation P0, delivery
 * is a no-op stub (events are persisted but not yet dispatched externally).
 *
 * OCMBR Reference: FOUND-IU-04 (D13-S01, D13-S08) — Service layer
 */

import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewEventOutbox,
  NewJobQueue,
} from "@/server/db/schema/intelligence-foundation";
import {
  eventOutbox,
  jobQueue,
} from "@/server/db/schema/intelligence-foundation";

// ── Event Outbox ──────────────────────────────────────────────────────────────

export async function publishEvent(
  domain: string,
  aggregateType: string,
  aggregateId: string | number,
  eventType: string,
  payload: Record<string, unknown>,
  targetConsumer?: string,
): Promise<typeof eventOutbox.$inferSelect | undefined> {
  const [result] = await db
    .insert(eventOutbox)
    .values({
      domain,
      aggregateType,
      aggregateId: String(aggregateId),
      eventType,
      payload,
      status: "PENDING",
      attempts: 0,
      targetConsumer,
    } satisfies Omit<NewEventOutbox, "id" | "createdAt">)
    .returning();
  return result;
}

export async function getPendingEvents(limit = 50) {
  return db
    .select()
    .from(eventOutbox)
    .where(eq(eventOutbox.status, "PENDING"))
    .limit(limit);
}

export async function markEventDelivered(id: number) {
  return db
    .update(eventOutbox)
    .set({ status: "DELIVERED", deliveredAt: new Date() })
    .where(eq(eventOutbox.id, id))
    .returning();
}

export async function markEventFailed(id: number, error: string) {
  return db
    .update(eventOutbox)
    .set({
      status: "FAILED",
      lastError: error,
      lastAttemptAt: new Date(),
      attempts: sql`${eventOutbox.attempts} + 1`,
    })
    .where(eq(eventOutbox.id, id))
    .returning();
}

export async function getEventsByAggregate(
  aggregateType: string,
  aggregateId: string,
) {
  return db
    .select()
    .from(eventOutbox)
    .where(
      and(
        eq(eventOutbox.aggregateType, aggregateType),
        eq(eventOutbox.aggregateId, aggregateId),
      ),
    );
}

// ── Job Queue ─────────────────────────────────────────────────────────────────

export async function enqueueJob(
  jobType: string,
  payload: Record<string, unknown>,
  options?: {
    domain?: string;
    priority?: number;
    maxAttempts?: number;
    scheduledAt?: Date;
  },
): Promise<typeof jobQueue.$inferSelect | undefined> {
  const [result] = await db
    .insert(jobQueue)
    .values({
      jobType,
      payload,
      domain: options?.domain,
      priority: options?.priority ?? 5,
      maxAttempts: options?.maxAttempts ?? 3,
      scheduledAt: options?.scheduledAt ?? new Date(),
      status: "QUEUED",
      attempts: 0,
    } satisfies Omit<NewJobQueue, "id" | "createdAt">)
    .returning();
  return result;
}

export async function getNextReadyJob() {
  const rows = await db
    .select()
    .from(jobQueue)
    .where(
      and(eq(jobQueue.status, "QUEUED"), lt(jobQueue.scheduledAt, new Date())),
    )
    .orderBy(jobQueue.priority, jobQueue.scheduledAt)
    .limit(1);
  return rows[0] ?? null;
}

export async function markJobComplete(
  id: number,
  result?: Record<string, unknown>,
) {
  return db
    .update(jobQueue)
    .set({ status: "COMPLETED", completedAt: new Date(), result })
    .where(eq(jobQueue.id, id))
    .returning();
}

export async function markJobFailed(id: number, error: string) {
  const rows = await db
    .select({ attempts: jobQueue.attempts, maxAttempts: jobQueue.maxAttempts })
    .from(jobQueue)
    .where(eq(jobQueue.id, id));
  const job = rows[0];
  if (!job) return null;
  const exhausted = job.attempts + 1 >= job.maxAttempts;
  return db
    .update(jobQueue)
    .set({
      status: exhausted ? "DEAD_LETTER" : "QUEUED",
      lastError: error,
      failedAt: exhausted ? new Date() : undefined,
      attempts: sql`${jobQueue.attempts} + 1`,
      scheduledAt: exhausted ? undefined : new Date(Date.now() + 60_000), // retry in 1 min
    })
    .where(eq(jobQueue.id, id))
    .returning();
}
