/**
 * OCMBR Foundation P0 — FOUND-IU-05
 * Domain Audit Trail Event Stream
 *
 * Extends the existing platform audit log with a domain-aware,
 * branch-scoped audit event table. Used by the Compliance domain (D12)
 * for CAPA, incident reporting, and regulatory evidence, and consumed
 * by the Intelligence layer (D13) for anomaly detection hooks.
 *
 * The existing `onx_sech_status_log` captures SECH/ethics events only.
 * This table captures ALL domain operations (create, update, delete,
 * approve, reject, etc.) with full before/after state.
 *
 * OCMBR Reference: FOUND-IU-05 (D13-S02)
 * Phase: Foundation P0
 * Blocks: D12 Compliance domain-level audit events; D13 anomaly hooks
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
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_domain_audit_event — immutable audit log for all domain operations
// Records are NEVER updated or deleted; append-only by design.
// ---------------------------------------------------------------------------
export const domainAuditEvent = createTable(
  "domain_audit_event",
  {
    id: serial("id").primaryKey(),
    /**
     * Source domain (e.g. "hr", "finance", "clinical", "pos").
     * Allows compliance queries to scope to a single domain.
     */
    domain: varchar("domain", { length: 50 }).notNull(),
    /** The entity type within the domain (e.g. "Employee", "Invoice") */
    aggregateType: varchar("aggregate_type", { length: 100 }).notNull(),
    /** Primary key of the entity */
    aggregateId: varchar("aggregate_id", { length: 255 }).notNull(),
    /**
     * Action performed (e.g. "CREATE", "UPDATE", "DELETE",
     * "APPROVE", "REJECT", "SUBMIT", "CANCEL")
     */
    action: varchar("action", { length: 50 }).notNull(),
    /** User who performed the action (null for system/scheduled events) */
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null",
    }),
    /** Actor display name captured at time of event (survives user deletion) */
    actorName: varchar("actor_name", { length: 256 }),
    /** Branch where the action occurred (null = platform-level action) */
    branchId: integer("branch_id"),
    /** Tenant context (null = single-tenant deployment) */
    tenantId: integer("tenant_id"),
    /** State BEFORE the action (null for CREATE actions) */
    oldValue: jsonb("old_value"),
    /** State AFTER the action (null for DELETE actions) */
    newValue: jsonb("new_value"),
    /** Additional context (e.g. reason, notes, reference IDs) */
    context: jsonb("context"),
    /** IP address of the actor's session (for security audit) */
    ipAddress: varchar("ip_address", { length: 45 }),
    /** User agent string (for security audit) */
    userAgent: text("user_agent"),
    /** Correlation ID to group related events (e.g. a multi-step workflow) */
    correlationId: varchar("correlation_id", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_domain_audit_domain_idx").on(table.domain),
    index("onx_domain_audit_aggregate_idx").on(
      table.aggregateType,
      table.aggregateId,
    ),
    index("onx_domain_audit_actor_idx").on(table.actorId),
    index("onx_domain_audit_action_idx").on(table.action),
    index("onx_domain_audit_branch_idx").on(table.branchId),
    index("onx_domain_audit_tenant_idx").on(table.tenantId),
    index("onx_domain_audit_created_idx").on(table.createdAt),
    index("onx_domain_audit_correlation_idx").on(table.correlationId),
  ],
);

// ---------------------------------------------------------------------------
// onx_audit_retention_policy — configures how long events are kept
// per domain and/or per tenant for compliance purposes.
// ---------------------------------------------------------------------------
export const auditRetentionPolicy = createTable(
  "audit_retention_policy",
  {
    id: serial("id").primaryKey(),
    domain: varchar("domain", { length: 50 }),
    tenantId: integer("tenant_id"),
    retentionDays: integer("retention_days").default(2555).notNull(), // ~7 years
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_audit_retention_domain_idx").on(table.domain),
    index("onx_audit_retention_tenant_idx").on(table.tenantId),
  ],
);

export type DomainAuditEvent = typeof domainAuditEvent.$inferSelect;
export type NewDomainAuditEvent = typeof domainAuditEvent.$inferInsert;
export type AuditRetentionPolicy = typeof auditRetentionPolicy.$inferSelect;
