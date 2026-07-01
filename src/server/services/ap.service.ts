/**
 * OCMBR Wave 2c — D03-S04 IU-SVC
 * Accounts Payable service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  apBill,
  apPayment,
  type NewApBill,
  type NewApPayment,
} from "@/server/db/schema";

export async function listBills(
  branchId: number,
  opts?: { vendorId?: number; status?: string },
) {
  const conditions = [eq(apBill.branchId, branchId)];
  if (opts?.vendorId) conditions.push(eq(apBill.vendorId, opts.vendorId));
  if (opts?.status) conditions.push(eq(apBill.status, opts.status));
  return db
    .select()
    .from(apBill)
    .where(and(...conditions))
    .orderBy(apBill.dueDate);
}

export async function getBillById(id: number) {
  const rows = await db.select().from(apBill).where(eq(apBill.id, id)).limit(1);
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "AP bill not found" });
  return rows[0];
}

export async function createBill(
  input: Omit<NewApBill, "id" | "createdAt" | "updatedAt">,
) {
  const rows = await db.insert(apBill).values(input).returning();
  return rows[0];
}

export async function approveBill(id: number) {
  const rows = await db
    .update(apBill)
    .set({ status: "APPROVED", updatedAt: new Date() })
    .where(and(eq(apBill.id, id), eq(apBill.status, "DRAFT")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Bill not found or not in DRAFT status",
    });
  return rows[0];
}

export async function cancelBill(id: number) {
  const rows = await db
    .update(apBill)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(apBill.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "AP bill not found" });
  return rows[0];
}

export async function getPaymentsForBill(billId: number) {
  return db.select().from(apPayment).where(eq(apPayment.billId, billId));
}

export async function recordPayment(
  input: Omit<NewApPayment, "id" | "createdAt">,
) {
  return db.transaction(async (tx) => {
    const [payment] = await tx.insert(apPayment).values(input).returning();
    // Recalculate paidAmount
    const allPayments = await tx
      .select()
      .from(apPayment)
      .where(eq(apPayment.billId, input.billId));
    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const [bill] = await tx
      .select()
      .from(apBill)
      .where(eq(apBill.id, input.billId))
      .limit(1);
    const totalAmount = Number(bill?.totalAmount ?? 0);
    const newStatus =
      totalPaid >= totalAmount
        ? "PAID"
        : totalPaid > 0
          ? "PARTIALLY_PAID"
          : "APPROVED";
    await tx
      .update(apBill)
      .set({
        paidAmount: String(totalPaid),
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(apBill.id, input.billId));
    return payment;
  });
}
