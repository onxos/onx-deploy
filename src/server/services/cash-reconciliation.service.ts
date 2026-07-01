/**
 * OCMBR Wave 2e — D08-S05 IU-SVC
 * Daily Cash Reconciliation service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  cashDenomination,
  cashReconciliation,
  type NewCashDenomination,
  type NewCashReconciliation,
} from "@/server/db/schema";

export function listReconciliations(branchId: number) {
  return db
    .select()
    .from(cashReconciliation)
    .where(eq(cashReconciliation.branchId, branchId))
    .orderBy(cashReconciliation.reconciliationDate);
}

export function getReconciliationById(id: number) {
  return db
    .select()
    .from(cashReconciliation)
    .where(eq(cashReconciliation.id, id));
}

export async function createReconciliation(
  input: NewCashReconciliation,
  denominations: Omit<NewCashDenomination, "reconciliationId">[],
) {
  return db.transaction(async (tx) => {
    const [rec] = await tx.insert(cashReconciliation).values(input).returning();
    if (denominations.length > 0) {
      await tx
        .insert(cashDenomination)
        .values(denominations.map((d) => ({ ...d, reconciliationId: rec.id })));
    }
    return rec;
  });
}

export function getDenominations(reconciliationId: number) {
  return db
    .select()
    .from(cashDenomination)
    .where(eq(cashDenomination.reconciliationId, reconciliationId));
}

export async function submitReconciliation(id: number) {
  const [result] = await db
    .update(cashReconciliation)
    .set({ status: "SUBMITTED", updatedAt: new Date() })
    .where(eq(cashReconciliation.id, id))
    .returning();
  return result;
}

export async function approveReconciliation(id: number, approvedBy: string) {
  const [result] = await db
    .update(cashReconciliation)
    .set({
      status: "APPROVED",
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(cashReconciliation.id, id))
    .returning();
  return result;
}
