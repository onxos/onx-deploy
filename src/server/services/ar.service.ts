/**
 * OCMBR Wave 2 — D03-S03 IU-API (Service)
 * Accounts Receivable service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  ArInvoice,
  ArPayment,
  NewArInvoice,
  NewArPayment,
} from "@/server/db/schema/ar-foundation";
import { arInvoice, arPayment } from "@/server/db/schema/ar-foundation";

// ── Invoices ──────────────────────────────────────────────────────────────────

export async function listInvoices(
  branchId: number,
  opts?: { clientId?: number; status?: string; limit?: number },
) {
  const conditions = [eq(arInvoice.branchId, branchId)];
  if (opts?.clientId) conditions.push(eq(arInvoice.clientId, opts.clientId));
  if (opts?.status) conditions.push(eq(arInvoice.status, opts.status));
  return db
    .select()
    .from(arInvoice)
    .where(and(...conditions))
    .orderBy(desc(arInvoice.createdAt))
    .limit(opts?.limit ?? 100);
}

export async function getInvoiceById(id: number) {
  const rows = await db.select().from(arInvoice).where(eq(arInvoice.id, id));
  return rows[0] ?? null;
}

export async function createInvoice(
  input: Omit<NewArInvoice, "id" | "createdAt" | "updatedAt">,
) {
  const existing = await db
    .select({ id: arInvoice.id })
    .from(arInvoice)
    .where(eq(arInvoice.invoiceNumber, input.invoiceNumber));
  if (existing.length > 0)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Invoice number already exists",
    });
  const [result] = await db.insert(arInvoice).values(input).returning();
  return result;
}

export async function issueInvoice(id: number) {
  const inv = await getInvoiceById(id);
  if (!inv)
    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
  if (inv.status !== "DRAFT")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Only DRAFT invoices can be issued",
    });
  const rows = await db
    .update(arInvoice)
    .set({ status: "ISSUED" })
    .where(eq(arInvoice.id, id))
    .returning();
  return rows[0] as ArInvoice;
}

export async function cancelInvoice(id: number) {
  const inv = await getInvoiceById(id);
  if (!inv)
    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
  if (inv.status === "PAID")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Paid invoices cannot be cancelled",
    });
  const rows = await db
    .update(arInvoice)
    .set({ status: "CANCELLED" })
    .where(eq(arInvoice.id, id))
    .returning();
  return rows[0] as ArInvoice;
}

// ── Payments ──────────────────────────────────────────────────────────────────

export async function getPaymentsForInvoice(invoiceId: number) {
  return db
    .select()
    .from(arPayment)
    .where(eq(arPayment.invoiceId, invoiceId))
    .orderBy(desc(arPayment.createdAt));
}

export async function recordPayment(
  input: Omit<NewArPayment, "id" | "createdAt">,
) {
  const inv = await getInvoiceById(input.invoiceId);
  if (!inv)
    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
  if (["CANCELLED", "PAID"].includes(inv.status))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot record payment on a CANCELLED or PAID invoice",
    });

  const [payment] = await db.insert(arPayment).values(input).returning();

  // Update paidAmount + status
  const newPaid = Number(inv.paidAmount ?? 0) + Number(input.amount);
  const total = Number(inv.totalAmount);
  const newStatus =
    newPaid >= total ? "PAID" : newPaid > 0 ? "PARTIALLY_PAID" : inv.status;

  await db
    .update(arInvoice)
    .set({
      paidAmount: String(newPaid),
      status: newStatus,
    })
    .where(eq(arInvoice.id, input.invoiceId));

  return payment as ArPayment;
}
