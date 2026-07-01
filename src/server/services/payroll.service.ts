/**
 * OCMBR Wave 2b — D02-S05 IU-SVC
 * Payroll Run service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewPayrollLine,
  type NewPayrollRun,
  payrollLine,
  payrollRun,
} from "@/server/db/schema";

export async function listPayrollRuns(
  branchId: number,
  opts?: { status?: string },
) {
  const conditions = [eq(payrollRun.branchId, branchId)];
  if (opts?.status) conditions.push(eq(payrollRun.status, opts.status));
  return db
    .select()
    .from(payrollRun)
    .where(and(...conditions))
    .orderBy(payrollRun.payPeriodEnd);
}

export async function getPayrollRunById(id: number) {
  const rows = await db
    .select()
    .from(payrollRun)
    .where(eq(payrollRun.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Payroll run not found",
    });
  return rows[0];
}

export async function createPayrollRun(
  input: Omit<NewPayrollRun, "id" | "createdAt" | "updatedAt">,
) {
  const rows = await db.insert(payrollRun).values(input).returning();
  return rows[0];
}

export async function addPayrollLine(input: Omit<NewPayrollLine, "id">) {
  const rows = await db.insert(payrollLine).values(input).returning();
  return rows[0];
}

export async function getPayrollLines(runId: number) {
  return db.select().from(payrollLine).where(eq(payrollLine.runId, runId));
}

export async function processPayrollRun(id: number, processedBy: string) {
  const rows = await db
    .update(payrollRun)
    .set({ status: "PROCESSING", processedBy, updatedAt: new Date() })
    .where(and(eq(payrollRun.id, id), eq(payrollRun.status, "DRAFT")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Payroll run not found or not in DRAFT status",
    });
  return rows[0];
}

export async function approvePayrollRun(id: number, approvedBy: string) {
  const rows = await db
    .update(payrollRun)
    .set({ status: "APPROVED", approvedBy, updatedAt: new Date() })
    .where(and(eq(payrollRun.id, id), eq(payrollRun.status, "PROCESSING")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Payroll run not found or not in PROCESSING status",
    });
  return rows[0];
}

export async function markPayrollPaid(id: number) {
  const rows = await db
    .update(payrollRun)
    .set({ status: "PAID", updatedAt: new Date() })
    .where(and(eq(payrollRun.id, id), eq(payrollRun.status, "APPROVED")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Payroll run not found or not in APPROVED status",
    });
  return rows[0];
}
