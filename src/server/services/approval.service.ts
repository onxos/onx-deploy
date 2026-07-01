/**
 * OCMBR Wave 2 — D04-S09 IU-API (Service)
 * Procurement Approval Workflow service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  ApprovalRecord,
  NewApprovalRecord,
  NewApprovalWorkflow,
} from "@/server/db/schema/approval-foundation";
import {
  approvalRecord,
  approvalWorkflow,
} from "@/server/db/schema/approval-foundation";

// ── Approval Workflows ────────────────────────────────────────────────────────

export async function listApprovalWorkflows(opts?: {
  entityType?: string;
  branchId?: number;
  activeOnly?: boolean;
}) {
  const conditions = [];
  if (opts?.entityType)
    conditions.push(eq(approvalWorkflow.entityType, opts.entityType));
  if (opts?.branchId)
    conditions.push(eq(approvalWorkflow.branchId, opts.branchId));
  if (opts?.activeOnly !== false)
    conditions.push(eq(approvalWorkflow.isActive, true));
  if (conditions.length === 0) return db.select().from(approvalWorkflow);
  return db
    .select()
    .from(approvalWorkflow)
    .where(and(...conditions));
}

export async function getApprovalWorkflowById(id: number) {
  const rows = await db
    .select()
    .from(approvalWorkflow)
    .where(eq(approvalWorkflow.id, id));
  return rows[0] ?? null;
}

export async function createApprovalWorkflow(
  input: Omit<NewApprovalWorkflow, "id" | "createdAt" | "updatedAt">,
) {
  const [result] = await db.insert(approvalWorkflow).values(input).returning();
  return result;
}

export async function updateApprovalWorkflow(
  id: number,
  input: Partial<Omit<NewApprovalWorkflow, "id" | "createdAt" | "entityType">>,
) {
  const rows = await db
    .update(approvalWorkflow)
    .set(input)
    .where(eq(approvalWorkflow.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Approval workflow not found",
    });
  return rows[0];
}

// ── Approval Records ──────────────────────────────────────────────────────────

export async function listApprovalRecords(
  entityType: string,
  entityId: number,
) {
  return db
    .select()
    .from(approvalRecord)
    .where(
      and(
        eq(approvalRecord.entityType, entityType),
        eq(approvalRecord.entityId, entityId),
      ),
    )
    .orderBy(desc(approvalRecord.createdAt));
}

export async function createApprovalRecord(
  input: Omit<NewApprovalRecord, "id" | "createdAt">,
) {
  const [result] = await db.insert(approvalRecord).values(input).returning();
  return result;
}

export async function processApproval(
  id: number,
  status: "APPROVED" | "REJECTED",
  comment?: string,
) {
  const rows = await db
    .update(approvalRecord)
    .set({ status, comment: comment ?? null, decidedAt: new Date() })
    .where(and(eq(approvalRecord.id, id), eq(approvalRecord.status, "PENDING")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Approval record not found or already decided",
    });
  return rows[0] as ApprovalRecord;
}
