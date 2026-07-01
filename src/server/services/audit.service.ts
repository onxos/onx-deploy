/**
 * OCMBR Foundation P0 — FOUND-IU-05 Service Layer
 * Audit Service: domain audit event recording
 *
 * Usage pattern:
 *   import { recordAudit } from "@/server/services/audit.service";
 *   await recordAudit({ domain: "hr", aggregateType: "Employee", ... });
 *
 * Audit records are IMMUTABLE. This service only appends; it never
 * updates or deletes audit events (append-only by design).
 *
 * OCMBR Reference: FOUND-IU-05 (D13-S02) — Service layer
 */

import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewDomainAuditEvent } from "@/server/db/schema/audit-foundation";
import {
  auditRetentionPolicy,
  domainAuditEvent,
} from "@/server/db/schema/audit-foundation";

// ── Record ────────────────────────────────────────────────────────────────────

export type AuditInput = {
  domain: string;
  aggregateType: string;
  aggregateId: string | number;
  action: string;
  actorId?: string | null;
  actorName?: string | null;
  branchId?: number | null;
  tenantId?: number | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  context?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  correlationId?: string | null;
};

export async function recordAudit(input: AuditInput) {
  const rows = await db
    .insert(domainAuditEvent)
    .values({
      domain: input.domain,
      aggregateType: input.aggregateType,
      aggregateId: String(input.aggregateId),
      action: input.action,
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      branchId: input.branchId ?? null,
      tenantId: input.tenantId ?? null,
      oldValue: input.oldValue ?? null,
      newValue: input.newValue ?? null,
      context: input.context ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      correlationId: input.correlationId ?? null,
    } satisfies Omit<NewDomainAuditEvent, "id" | "createdAt">)
    .returning();
  const [result] = rows;
  return result;
}

// ── Query ─────────────────────────────────────────────────────────────────────

export async function getAuditTrail(
  filters: {
    domain?: string;
    aggregateType?: string;
    aggregateId?: string;
    actorId?: string;
    branchId?: number;
    tenantId?: number;
    action?: string;
    fromDate?: Date;
    toDate?: Date;
  },
  limit = 100,
) {
  const conditions = [];
  if (filters.domain)
    conditions.push(eq(domainAuditEvent.domain, filters.domain));
  if (filters.aggregateType)
    conditions.push(eq(domainAuditEvent.aggregateType, filters.aggregateType));
  if (filters.aggregateId)
    conditions.push(eq(domainAuditEvent.aggregateId, filters.aggregateId));
  if (filters.actorId)
    conditions.push(eq(domainAuditEvent.actorId, filters.actorId));
  if (filters.branchId !== undefined)
    conditions.push(eq(domainAuditEvent.branchId, filters.branchId));
  if (filters.tenantId !== undefined)
    conditions.push(eq(domainAuditEvent.tenantId, filters.tenantId));
  if (filters.action)
    conditions.push(eq(domainAuditEvent.action, filters.action));
  if (filters.fromDate)
    conditions.push(gte(domainAuditEvent.createdAt, filters.fromDate));
  if (filters.toDate)
    conditions.push(lte(domainAuditEvent.createdAt, filters.toDate));

  const query = db
    .select()
    .from(domainAuditEvent)
    .orderBy(desc(domainAuditEvent.createdAt))
    .limit(limit);

  return conditions.length > 0 ? query.where(and(...conditions)) : query;
}

export async function getAuditForEntity(
  aggregateType: string,
  aggregateId: string | number,
) {
  return db
    .select()
    .from(domainAuditEvent)
    .where(
      and(
        eq(domainAuditEvent.aggregateType, aggregateType),
        eq(domainAuditEvent.aggregateId, String(aggregateId)),
      ),
    )
    .orderBy(desc(domainAuditEvent.createdAt));
}

// ── Retention ─────────────────────────────────────────────────────────────────

export async function getRetentionPolicy(domain?: string, tenantId?: number) {
  const conditions = [];
  if (domain) conditions.push(eq(auditRetentionPolicy.domain, domain));
  if (tenantId !== undefined)
    conditions.push(eq(auditRetentionPolicy.tenantId, tenantId));
  const rows =
    conditions.length > 0
      ? await db
          .select()
          .from(auditRetentionPolicy)
          .where(and(...conditions))
      : await db.select().from(auditRetentionPolicy);
  return rows[0] ?? { retentionDays: 2555 }; // default 7 years
}
