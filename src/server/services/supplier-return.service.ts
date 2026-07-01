/**
 * OCMBR Wave 2d — D04-S06 IU-SVC
 * Supplier Returns service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewSupplierReturn,
  type NewSupplierReturnLine,
  supplierReturn,
  supplierReturnLine,
} from "@/server/db/schema";

export function listReturns(branchId: number) {
  return db
    .select()
    .from(supplierReturn)
    .where(eq(supplierReturn.branchId, branchId))
    .orderBy(supplierReturn.createdAt);
}

export function getReturnById(id: number) {
  return db.select().from(supplierReturn).where(eq(supplierReturn.id, id));
}

export async function createReturn(
  input: NewSupplierReturn,
  lines: Omit<NewSupplierReturnLine, "returnId">[],
) {
  return db.transaction(async (tx) => {
    const [ret] = await tx.insert(supplierReturn).values(input).returning();
    if (lines.length > 0) {
      await tx
        .insert(supplierReturnLine)
        .values(lines.map((l) => ({ ...l, returnId: ret.id })));
    }
    return ret;
  });
}

export function getReturnLines(returnId: number) {
  return db
    .select()
    .from(supplierReturnLine)
    .where(eq(supplierReturnLine.returnId, returnId));
}

export async function confirmReturn(id: number) {
  const [result] = await db
    .update(supplierReturn)
    .set({ status: "CONFIRMED", updatedAt: new Date() })
    .where(eq(supplierReturn.id, id))
    .returning();
  return result;
}

export async function cancelReturn(id: number) {
  const [result] = await db
    .update(supplierReturn)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(supplierReturn.id, id))
    .returning();
  return result;
}
