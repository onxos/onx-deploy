/**
 * OCMBR Wave 2 — D02-S03 IU-API (Service)
 * Attendance & Timesheet service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewTimesheetEntry,
  TimesheetEntry,
} from "@/server/db/schema/attendance-foundation";
import { timesheetEntry } from "@/server/db/schema/attendance-foundation";

export async function listTimesheetEntries(
  branchId: number,
  opts?: { employeeId?: number; status?: string; limit?: number },
) {
  const conditions = [eq(timesheetEntry.branchId, branchId)];
  if (opts?.employeeId)
    conditions.push(eq(timesheetEntry.employeeId, opts.employeeId));
  if (opts?.status) conditions.push(eq(timesheetEntry.status, opts.status));
  return db
    .select()
    .from(timesheetEntry)
    .where(and(...conditions))
    .orderBy(desc(timesheetEntry.entryDate))
    .limit(opts?.limit ?? 100);
}

export async function getTimesheetEntryById(id: number) {
  const rows = await db
    .select()
    .from(timesheetEntry)
    .where(eq(timesheetEntry.id, id));
  return rows[0] ?? null;
}

export async function createTimesheetEntry(
  input: Omit<NewTimesheetEntry, "id" | "createdAt" | "updatedAt">,
) {
  const [result] = await db.insert(timesheetEntry).values(input).returning();
  return result;
}

export async function updateTimesheetEntry(
  id: number,
  input: Partial<
    Omit<NewTimesheetEntry, "id" | "createdAt" | "employeeId" | "branchId">
  >,
) {
  const rows = await db
    .update(timesheetEntry)
    .set(input)
    .where(eq(timesheetEntry.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Timesheet entry not found",
    });
  return rows[0] as TimesheetEntry;
}

export async function approveTimesheetEntry(id: number, approvedBy: string) {
  return updateTimesheetEntry(id, { status: "APPROVED", approvedBy });
}

export async function rejectTimesheetEntry(
  id: number,
  approvedBy: string,
  notes?: string,
) {
  return updateTimesheetEntry(id, {
    status: "REJECTED",
    approvedBy,
    notes: notes ?? undefined,
  });
}
