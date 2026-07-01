/**
 * OCMBR Wave 2 — D02-S04 IU-API (Service)
 * Leave Management service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  LeaveRequest,
  NewLeaveRequest,
  NewLeaveType,
} from "@/server/db/schema/leave-foundation";
import { leaveRequest, leaveType } from "@/server/db/schema/leave-foundation";

// ── Leave Types ───────────────────────────────────────────────────────────────

export async function listLeaveTypes(activeOnly = true) {
  if (activeOnly)
    return db.select().from(leaveType).where(eq(leaveType.isActive, true));
  return db.select().from(leaveType);
}

export async function getLeaveTypeById(id: number) {
  const rows = await db.select().from(leaveType).where(eq(leaveType.id, id));
  return rows[0] ?? null;
}

export async function createLeaveType(
  input: Omit<NewLeaveType, "id" | "createdAt" | "updatedAt">,
) {
  const existing = await db
    .select({ id: leaveType.id })
    .from(leaveType)
    .where(eq(leaveType.code, input.code));
  if (existing.length > 0)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Leave type code already exists",
    });
  const [result] = await db.insert(leaveType).values(input).returning();
  return result;
}

// ── Leave Requests ────────────────────────────────────────────────────────────

export async function listLeaveRequests(
  branchId: number,
  opts?: { employeeId?: number; status?: string },
) {
  const conditions = [eq(leaveRequest.branchId, branchId)];
  if (opts?.employeeId)
    conditions.push(eq(leaveRequest.employeeId, opts.employeeId));
  if (opts?.status) conditions.push(eq(leaveRequest.status, opts.status));
  return db
    .select()
    .from(leaveRequest)
    .where(and(...conditions))
    .orderBy(desc(leaveRequest.createdAt));
}

export async function getLeaveRequestById(id: number) {
  const rows = await db
    .select()
    .from(leaveRequest)
    .where(eq(leaveRequest.id, id));
  return rows[0] ?? null;
}

export async function createLeaveRequest(
  input: Omit<NewLeaveRequest, "id" | "createdAt" | "updatedAt">,
) {
  const [result] = await db.insert(leaveRequest).values(input).returning();
  return result;
}

export async function reviewLeaveRequest(
  id: number,
  status: "APPROVED" | "REJECTED",
  reviewedBy: string,
) {
  const rows = await db
    .update(leaveRequest)
    .set({ status, reviewedBy, reviewedAt: new Date() })
    .where(eq(leaveRequest.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Leave request not found",
    });
  return rows[0] as LeaveRequest;
}

export async function cancelLeaveRequest(id: number) {
  const existing = await getLeaveRequestById(id);
  if (!existing)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Leave request not found",
    });
  if (!["PENDING", "APPROVED"].includes(existing.status))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Only PENDING or APPROVED requests can be cancelled",
    });
  const rows = await db
    .update(leaveRequest)
    .set({ status: "CANCELLED" })
    .where(eq(leaveRequest.id, id))
    .returning();
  return rows[0] as LeaveRequest;
}
