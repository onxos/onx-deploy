/**
 * OCMBR Wave 1 — D09-S01 Service Layer
 * Clinical Service: Patient Visit & Registration
 * IU-ID: D09-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewPatientVisit } from "@/server/db/schema/clinical-foundation";
import { patientVisit } from "@/server/db/schema/clinical-foundation";

function generateVisitNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `VIS-${dateStr}-${rand}`;
}

export async function listVisits(
  branchId: number,
  opts?: { status?: string; petId?: number; limit?: number },
) {
  const conditions = [eq(patientVisit.branchId, branchId)];
  if (opts?.status) conditions.push(eq(patientVisit.status, opts.status));
  if (opts?.petId) conditions.push(eq(patientVisit.petId, opts.petId));
  return db
    .select()
    .from(patientVisit)
    .where(and(...conditions))
    .orderBy(desc(patientVisit.createdAt))
    .limit(opts?.limit ?? 50);
}

export async function getVisitById(id: number) {
  const [row] = await db
    .select()
    .from(patientVisit)
    .where(eq(patientVisit.id, id));
  return row ?? null;
}

export async function registerVisit(
  input: Omit<
    NewPatientVisit,
    "id" | "visitNumber" | "createdAt" | "updatedAt"
  >,
) {
  const visitNumber = generateVisitNumber();
  const [result] = await db
    .insert(patientVisit)
    .values({ ...input, visitNumber, status: input.status ?? "PENDING" })
    .returning();
  return result;
}

export async function updateVisitStatus(
  id: number,
  status: string,
  extra?: { assignedVetId?: string; checkInAt?: Date; checkOutAt?: Date },
) {
  const rows = await db
    .update(patientVisit)
    .set({ status, ...extra })
    .where(eq(patientVisit.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Visit not found" });
  return rows[0];
}

export async function updateVisit(
  id: number,
  input: Partial<Omit<NewPatientVisit, "id" | "createdAt">>,
) {
  const rows = await db
    .update(patientVisit)
    .set(input)
    .where(eq(patientVisit.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Visit not found" });
  return rows[0];
}
