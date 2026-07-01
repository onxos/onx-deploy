/**
 * OCMBR Wave 2b — D05-S03 IU-SVC
 * Item Batch / Lot Tracking service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { itemBatch, type NewItemBatch } from "@/server/db/schema";

export async function listItemBatches(
  branchId: number,
  opts?: { itemId?: number; status?: string },
) {
  const conditions = [eq(itemBatch.branchId, branchId)];
  if (opts?.itemId) conditions.push(eq(itemBatch.itemId, opts.itemId));
  if (opts?.status) conditions.push(eq(itemBatch.status, opts.status));
  return db
    .select()
    .from(itemBatch)
    .where(and(...conditions))
    .orderBy(itemBatch.expiryDate);
}

export async function getItemBatchById(id: number) {
  const rows = await db
    .select()
    .from(itemBatch)
    .where(eq(itemBatch.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Item batch not found" });
  return rows[0];
}

export async function createItemBatch(
  input: Omit<NewItemBatch, "id" | "createdAt" | "updatedAt">,
) {
  const rows = await db.insert(itemBatch).values(input).returning();
  return rows[0];
}

export async function updateItemBatch(
  id: number,
  input: Partial<
    Omit<NewItemBatch, "id" | "createdAt" | "updatedAt" | "itemId" | "branchId">
  >,
) {
  const rows = await db
    .update(itemBatch)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(itemBatch.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Item batch not found" });
  return rows[0];
}

export async function quarantineBatch(id: number) {
  return updateItemBatch(id, { status: "QUARANTINE" });
}

export async function listExpiringBatches(
  branchId: number,
  beforeDate: string,
) {
  // Returns batches with expiry_date <= beforeDate and status = ACTIVE
  const rows = await db
    .select()
    .from(itemBatch)
    .where(
      and(eq(itemBatch.branchId, branchId), eq(itemBatch.status, "ACTIVE")),
    );
  return rows.filter(
    (b) => b.expiryDate !== null && b.expiryDate <= beforeDate,
  );
}
