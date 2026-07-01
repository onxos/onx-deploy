/**
 * OCMBR Wave 2d — D03-S05 IU-SVC
 * Bank Reconciliation service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  bankReconciliation,
  bankReconciliationLine,
  type NewBankReconciliation,
  type NewBankReconciliationLine,
} from "@/server/db/schema";

export function listReconciliations(branchId: number) {
  return db
    .select()
    .from(bankReconciliation)
    .where(eq(bankReconciliation.branchId, branchId))
    .orderBy(bankReconciliation.statementDate);
}

export function getReconciliationById(id: number) {
  return db
    .select()
    .from(bankReconciliation)
    .where(eq(bankReconciliation.id, id));
}

export async function createReconciliation(
  input: NewBankReconciliation,
  lines: Omit<NewBankReconciliationLine, "reconciliationId">[],
) {
  return db.transaction(async (tx) => {
    const [rec] = await tx.insert(bankReconciliation).values(input).returning();
    if (lines.length > 0) {
      await tx
        .insert(bankReconciliationLine)
        .values(lines.map((l) => ({ ...l, reconciliationId: rec.id })));
    }
    return rec;
  });
}

export function getLines(reconciliationId: number) {
  return db
    .select()
    .from(bankReconciliationLine)
    .where(eq(bankReconciliationLine.reconciliationId, reconciliationId));
}

export async function finalizeReconciliation(id: number, reconciledBy: string) {
  const [result] = await db
    .update(bankReconciliation)
    .set({
      status: "RECONCILED",
      reconciledBy,
      reconciledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(bankReconciliation.id, id))
    .returning();
  return result;
}

export async function cancelReconciliation(id: number) {
  const [result] = await db
    .update(bankReconciliation)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(bankReconciliation.id, id))
    .returning();
  return result;
}
