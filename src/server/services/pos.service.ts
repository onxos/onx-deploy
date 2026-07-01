/**
 * OCMBR Wave 1 — D08-S01 Service Layer
 * POS Service: Terminal + Shift management
 * IU-ID: D08-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewPosShift,
  NewPosTerminal,
} from "@/server/db/schema/pos-foundation";
import { posShift, posTerminal } from "@/server/db/schema/pos-foundation";

// ── Terminal ──────────────────────────────────────────────────────────────────

export async function listTerminals(branchId: number) {
  return db
    .select()
    .from(posTerminal)
    .where(eq(posTerminal.branchId, branchId));
}

export async function getTerminalById(id: number) {
  const [row] = await db
    .select()
    .from(posTerminal)
    .where(eq(posTerminal.id, id));
  return row ?? null;
}

export async function createTerminal(
  input: Omit<NewPosTerminal, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: posTerminal.id })
    .from(posTerminal)
    .where(eq(posTerminal.terminalCode, input.terminalCode));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Terminal code already exists",
    });
  const [result] = await db.insert(posTerminal).values(input).returning();
  return result;
}

export async function updateTerminal(
  id: number,
  input: Partial<Omit<NewPosTerminal, "id" | "createdAt" | "updatedAt">>,
) {
  const rows = await db
    .update(posTerminal)
    .set(input)
    .where(eq(posTerminal.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Terminal not found" });
  return rows[0];
}

// ── Shift ─────────────────────────────────────────────────────────────────────

export async function listShifts(
  branchId: number,
  opts?: { status?: string; limit?: number },
) {
  const conditions = [eq(posShift.branchId, branchId)];
  if (opts?.status) conditions.push(eq(posShift.status, opts.status));
  return db
    .select()
    .from(posShift)
    .where(and(...conditions))
    .limit(opts?.limit ?? 50);
}

export async function getActiveShift(terminalId: number) {
  const [row] = await db
    .select()
    .from(posShift)
    .where(
      and(eq(posShift.terminalId, terminalId), eq(posShift.status, "OPEN")),
    );
  return row ?? null;
}

export async function openShift(
  input: Omit<NewPosShift, "id" | "createdAt" | "status" | "openedAt">,
) {
  const active = await getActiveShift(input.terminalId);
  if (active) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Terminal already has an open shift",
    });
  }
  const [shift] = await db
    .insert(posShift)
    .values({
      ...input,
      status: "OPEN",
      openedAt: new Date(),
    })
    .returning();
  if (shift) {
    await db
      .update(posTerminal)
      .set({ currentShiftId: shift.id })
      .where(eq(posTerminal.id, input.terminalId));
  }
  return shift;
}

export async function closeShift(
  id: number,
  closingBalance: number,
  notes?: string,
) {
  const shift = await db.select().from(posShift).where(eq(posShift.id, id));
  if (!shift[0])
    throw new TRPCError({ code: "NOT_FOUND", message: "Shift not found" });
  if (shift[0].status !== "OPEN") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Shift is not open" });
  }
  const rows = await db
    .update(posShift)
    .set({
      status: "CLOSED",
      closedAt: new Date(),
      closingBalance: String(closingBalance),
      notes,
    })
    .where(eq(posShift.id, id))
    .returning();
  // Clear currentShiftId from terminal
  await db
    .update(posTerminal)
    .set({ currentShiftId: null })
    .where(eq(posTerminal.id, shift[0].terminalId));
  return rows[0];
}
