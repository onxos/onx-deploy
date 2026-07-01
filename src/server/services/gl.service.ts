/**
 * OCMBR Wave 1 — D03-S02 Service Layer
 * GL Service: Fiscal Period + Journal Entry management
 * IU-ID: D03-S02-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewGlEntry,
  NewGlEntryLine,
  NewGlPeriod,
} from "@/server/db/schema/gl-foundation";
import {
  glEntry,
  glEntryLine,
  glPeriod,
} from "@/server/db/schema/gl-foundation";

function generateEntryNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `JE-${dateStr}-${rand}`;
}

// ── GL Period ─────────────────────────────────────────────────────────────────

export async function listPeriods(branchId?: number) {
  return branchId
    ? db.select().from(glPeriod).where(eq(glPeriod.branchId, branchId))
    : db.select().from(glPeriod);
}

export async function createPeriod(
  input: Omit<NewGlPeriod, "id" | "createdAt">,
) {
  const [result] = await db.insert(glPeriod).values(input).returning();
  return result;
}

export async function closePeriod(id: number) {
  const rows = await db
    .update(glPeriod)
    .set({ status: "CLOSED" })
    .where(eq(glPeriod.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Period not found" });
  return rows[0];
}

// ── GL Entry ──────────────────────────────────────────────────────────────────

export async function listEntries(
  branchId: number,
  opts?: { status?: string; limit?: number },
) {
  const conditions = [eq(glEntry.branchId, branchId)];
  if (opts?.status) conditions.push(eq(glEntry.status, opts.status));
  return db
    .select()
    .from(glEntry)
    .where(and(...conditions))
    .orderBy(desc(glEntry.createdAt))
    .limit(opts?.limit ?? 50);
}

export async function getEntryById(id: number) {
  const [row] = await db.select().from(glEntry).where(eq(glEntry.id, id));
  return row ?? null;
}

export async function createEntry(
  input: Omit<NewGlEntry, "id" | "entryNumber" | "createdAt" | "updatedAt">,
  lines: Omit<NewGlEntryLine, "id" | "entryId" | "lineNumber">[],
) {
  if (lines.length < 2) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Journal entry requires at least 2 lines",
    });
  }
  const totalDebit = lines.reduce((s, l) => s + Number(l.debit ?? 0), 0);
  const totalCredit = lines.reduce((s, l) => s + Number(l.credit ?? 0), 0);
  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Journal entry must balance: debit ≠ credit",
    });
  }
  const entryNumber = generateEntryNumber();
  const [entry] = await db
    .insert(glEntry)
    .values({
      ...input,
      entryNumber,
      totalDebit: String(totalDebit),
      totalCredit: String(totalCredit),
    })
    .returning();
  if (!entry)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create entry",
    });
  await db
    .insert(glEntryLine)
    .values(
      lines.map((l, i) => ({ ...l, entryId: entry.id, lineNumber: i + 1 })),
    );
  return entry;
}

export async function postEntry(id: number) {
  const existing = await getEntryById(id);
  if (!existing)
    throw new TRPCError({ code: "NOT_FOUND", message: "Entry not found" });
  if (existing.status !== "DRAFT") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Only DRAFT entries can be posted",
    });
  }
  const rows = await db
    .update(glEntry)
    .set({ status: "POSTED", postedAt: new Date() })
    .where(eq(glEntry.id, id))
    .returning();
  return rows[0];
}

export async function getEntryLines(entryId: number) {
  return db.select().from(glEntryLine).where(eq(glEntryLine.entryId, entryId));
}
