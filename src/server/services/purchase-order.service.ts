/**
 * OCMBR Wave 2b — D04-S04 IU-SVC
 * Purchase Order service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewPoLine,
  type NewPurchaseOrder,
  poLine,
  purchaseOrder,
} from "@/server/db/schema";

export async function listPurchaseOrders(
  branchId: number,
  opts?: { status?: string; vendorId?: number },
) {
  const conditions = [eq(purchaseOrder.branchId, branchId)];
  if (opts?.status) conditions.push(eq(purchaseOrder.status, opts.status));
  if (opts?.vendorId)
    conditions.push(eq(purchaseOrder.vendorId, opts.vendorId));
  return db
    .select()
    .from(purchaseOrder)
    .where(and(...conditions))
    .orderBy(purchaseOrder.orderDate);
}

export async function getPurchaseOrderById(id: number) {
  const rows = await db
    .select()
    .from(purchaseOrder)
    .where(eq(purchaseOrder.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Purchase order not found",
    });
  return rows[0];
}

export async function createPurchaseOrder(
  input: Omit<NewPurchaseOrder, "id" | "createdAt" | "updatedAt">,
  lines: Omit<NewPoLine, "id" | "poId">[],
) {
  return db.transaction(async (tx) => {
    const [po] = await tx.insert(purchaseOrder).values(input).returning();
    if (lines.length > 0) {
      await tx
        .insert(poLine)
        .values(lines.map((l) => ({ ...l, poId: po?.id ?? 0 })));
    }
    return po;
  });
}

export async function getPoLines(poId: number) {
  return db.select().from(poLine).where(eq(poLine.poId, poId));
}

export async function sendPurchaseOrder(id: number) {
  const rows = await db
    .update(purchaseOrder)
    .set({ status: "SENT", updatedAt: new Date() })
    .where(and(eq(purchaseOrder.id, id), eq(purchaseOrder.status, "DRAFT")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "PO not found or not in DRAFT status",
    });
  return rows[0];
}

export async function cancelPurchaseOrder(id: number) {
  const rows = await db
    .update(purchaseOrder)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(purchaseOrder.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Purchase order not found",
    });
  return rows[0];
}
