/**
 * OCMBR Wave 2c — D06-S04 IU-SVC
 * Insurance Claim service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { insuranceClaim, type NewInsuranceClaim } from "@/server/db/schema";

export async function listClaims(
  branchId: number,
  opts?: { policyId?: number; status?: string; petId?: number },
) {
  const conditions = [eq(insuranceClaim.branchId, branchId)];
  if (opts?.policyId)
    conditions.push(eq(insuranceClaim.policyId, opts.policyId));
  if (opts?.petId) conditions.push(eq(insuranceClaim.petId, opts.petId));
  if (opts?.status) conditions.push(eq(insuranceClaim.status, opts.status));
  return db
    .select()
    .from(insuranceClaim)
    .where(and(...conditions))
    .orderBy(insuranceClaim.claimDate);
}

export async function getClaimById(id: number) {
  const rows = await db
    .select()
    .from(insuranceClaim)
    .where(eq(insuranceClaim.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Insurance claim not found",
    });
  return rows[0];
}

export async function createClaim(
  input: Omit<NewInsuranceClaim, "id" | "createdAt" | "updatedAt">,
) {
  const rows = await db.insert(insuranceClaim).values(input).returning();
  return rows[0];
}

export async function reviewClaim(
  id: number,
  status: "APPROVED" | "REJECTED",
  reviewedBy: string,
  approvedAmount?: string,
) {
  const rows = await db
    .update(insuranceClaim)
    .set({
      status,
      reviewedBy,
      reviewedAt: new Date(),
      approvedAmount: approvedAmount ?? "0",
      updatedAt: new Date(),
    })
    .where(
      and(eq(insuranceClaim.id, id), eq(insuranceClaim.status, "UNDER_REVIEW")),
    )
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Claim not found or not in UNDER_REVIEW status",
    });
  return rows[0];
}

export async function updateClaimStatus(
  id: number,
  status: string,
  paidAmount?: string,
) {
  const rows = await db
    .update(insuranceClaim)
    .set({
      status,
      ...(paidAmount ? { paidAmount } : {}),
      updatedAt: new Date(),
    })
    .where(eq(insuranceClaim.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Insurance claim not found",
    });
  return rows[0];
}
