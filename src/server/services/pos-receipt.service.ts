/**
 * OCMBR Wave 2f — D08-S04 IU-SVC
 * Receipt & Invoice Generation service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewPosReceipt,
  type NewPosReceiptLine,
  posReceipt,
  posReceiptLine,
} from "@/server/db/schema";

export function listReceipts(branchId: number) {
  return db
    .select()
    .from(posReceipt)
    .where(eq(posReceipt.branchId, branchId))
    .orderBy(posReceipt.transactionDate);
}

export function getReceiptById(id: number) {
  return db.select().from(posReceipt).where(eq(posReceipt.id, id));
}

export async function createReceipt(
  input: NewPosReceipt,
  lines: Omit<NewPosReceiptLine, "receiptId">[],
) {
  return db.transaction(async (tx) => {
    const [receipt] = await tx.insert(posReceipt).values(input).returning();
    if (lines.length > 0) {
      await tx
        .insert(posReceiptLine)
        .values(lines.map((l) => ({ ...l, receiptId: receipt.id })));
    }
    return receipt;
  });
}

export function getReceiptLines(receiptId: number) {
  return db
    .select()
    .from(posReceiptLine)
    .where(eq(posReceiptLine.receiptId, receiptId));
}

export async function voidReceipt(id: number) {
  const [result] = await db
    .update(posReceipt)
    .set({ status: "VOIDED" })
    .where(eq(posReceipt.id, id))
    .returning();
  return result;
}
