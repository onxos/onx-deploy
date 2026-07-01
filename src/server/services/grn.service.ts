/**
 * OCMBR Wave 2c — D04-S05 IU-SVC
 * Goods Received Note (GRN) service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { grn, grnLine, type NewGrn, type NewGrnLine } from "@/server/db/schema";

export async function listGrns(
  branchId: number,
  opts?: { poId?: number; status?: string },
) {
  const conditions = [eq(grn.branchId, branchId)];
  if (opts?.poId) conditions.push(eq(grn.poId, opts.poId));
  if (opts?.status) conditions.push(eq(grn.status, opts.status));
  return db
    .select()
    .from(grn)
    .where(and(...conditions))
    .orderBy(grn.receivedDate);
}

export async function getGrnById(id: number) {
  const rows = await db.select().from(grn).where(eq(grn.id, id)).limit(1);
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "GRN not found" });
  return rows[0];
}

export async function createGrn(
  input: Omit<NewGrn, "id" | "createdAt" | "updatedAt">,
  lines: Omit<NewGrnLine, "id" | "grnId">[],
) {
  return db.transaction(async (tx) => {
    const [grnRecord] = await tx.insert(grn).values(input).returning();
    if (lines.length > 0) {
      await tx
        .insert(grnLine)
        .values(lines.map((l) => ({ ...l, grnId: grnRecord?.id ?? 0 })));
    }
    return grnRecord;
  });
}

export async function getGrnLines(grnId: number) {
  return db.select().from(grnLine).where(eq(grnLine.grnId, grnId));
}

export async function confirmGrn(id: number) {
  const rows = await db
    .update(grn)
    .set({ status: "CONFIRMED", updatedAt: new Date() })
    .where(and(eq(grn.id, id), eq(grn.status, "DRAFT")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "GRN not found or not in DRAFT status",
    });
  return rows[0];
}

export async function cancelGrn(id: number) {
  const rows = await db
    .update(grn)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(grn.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "GRN not found" });
  return rows[0];
}
