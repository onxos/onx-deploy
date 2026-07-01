/**
 * OCMBR Wave 2 — D04-S02 IU-API (Service)
 * Purchase Requisition service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewPrLine,
  NewPurchaseRequisition,
  PurchaseRequisition,
} from "@/server/db/schema/procurement-pr-foundation";
import {
  prLine,
  purchaseRequisition,
} from "@/server/db/schema/procurement-pr-foundation";

// ── Purchase Requisitions ─────────────────────────────────────────────────────

export async function listPurchaseRequisitions(
  branchId: number,
  opts?: { status?: string; requestedBy?: string },
) {
  const conditions = [eq(purchaseRequisition.branchId, branchId)];
  if (opts?.status)
    conditions.push(eq(purchaseRequisition.status, opts.status));
  if (opts?.requestedBy)
    conditions.push(eq(purchaseRequisition.requestedBy, opts.requestedBy));
  return db
    .select()
    .from(purchaseRequisition)
    .where(and(...conditions))
    .orderBy(desc(purchaseRequisition.createdAt));
}

export async function getPurchaseRequisitionById(id: number) {
  const rows = await db
    .select()
    .from(purchaseRequisition)
    .where(eq(purchaseRequisition.id, id));
  return rows[0] ?? null;
}

export async function createPurchaseRequisition(
  input: Omit<NewPurchaseRequisition, "id" | "createdAt" | "updatedAt">,
  lines: Omit<NewPrLine, "id" | "prId">[],
) {
  const existing = await db
    .select({ id: purchaseRequisition.id })
    .from(purchaseRequisition)
    .where(eq(purchaseRequisition.prNumber, input.prNumber));
  if (existing.length > 0)
    throw new TRPCError({
      code: "CONFLICT",
      message: "PR number already exists",
    });

  const [pr] = await db.insert(purchaseRequisition).values(input).returning();

  if (lines.length > 0) {
    await db
      .insert(prLine)
      .values(lines.map((l, i) => ({ ...l, prId: pr.id, lineNumber: i + 1 })));
  }

  return pr;
}

export async function submitPurchaseRequisition(id: number) {
  const pr = await getPurchaseRequisitionById(id);
  if (!pr) throw new TRPCError({ code: "NOT_FOUND", message: "PR not found" });
  if (pr.status !== "DRAFT")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Only DRAFT PRs can be submitted",
    });
  const rows = await db
    .update(purchaseRequisition)
    .set({ status: "PENDING_APPROVAL" })
    .where(eq(purchaseRequisition.id, id))
    .returning();
  return rows[0] as PurchaseRequisition;
}

export async function approvePurchaseRequisition(id: number) {
  const rows = await db
    .update(purchaseRequisition)
    .set({ status: "APPROVED" })
    .where(
      and(
        eq(purchaseRequisition.id, id),
        eq(purchaseRequisition.status, "PENDING_APPROVAL"),
      ),
    )
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "PR not found or not in PENDING_APPROVAL status",
    });
  return rows[0] as PurchaseRequisition;
}

export async function rejectPurchaseRequisition(id: number) {
  const rows = await db
    .update(purchaseRequisition)
    .set({ status: "REJECTED" })
    .where(
      and(
        eq(purchaseRequisition.id, id),
        eq(purchaseRequisition.status, "PENDING_APPROVAL"),
      ),
    )
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "PR not found or not in PENDING_APPROVAL status",
    });
  return rows[0] as PurchaseRequisition;
}

export async function getPrLines(prId: number) {
  return db.select().from(prLine).where(eq(prLine.prId, prId));
}
