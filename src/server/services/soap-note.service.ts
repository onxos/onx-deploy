/**
 * OCMBR Wave 2b — D09-S03 IU-SVC
 * SOAP Consultation Note service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { type NewSoapNote, soapNote } from "@/server/db/schema";

export async function listSoapNotes(
  branchId: number,
  opts?: { petId?: number; vetId?: string; status?: string },
) {
  const conditions = [eq(soapNote.branchId, branchId)];
  if (opts?.petId) conditions.push(eq(soapNote.petId, opts.petId));
  if (opts?.vetId) conditions.push(eq(soapNote.attendingVetId, opts.vetId));
  if (opts?.status) conditions.push(eq(soapNote.status, opts.status));
  return db
    .select()
    .from(soapNote)
    .where(and(...conditions))
    .orderBy(soapNote.consultationDate);
}

export async function getSoapNoteById(id: number) {
  const rows = await db
    .select()
    .from(soapNote)
    .where(eq(soapNote.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "SOAP note not found" });
  return rows[0];
}

export async function createSoapNote(
  input: Omit<NewSoapNote, "id" | "createdAt" | "updatedAt">,
) {
  const rows = await db.insert(soapNote).values(input).returning();
  return rows[0];
}

export async function updateSoapNote(
  id: number,
  input: Partial<
    Omit<
      NewSoapNote,
      "id" | "createdAt" | "updatedAt" | "petId" | "clientId" | "branchId"
    >
  >,
) {
  const rows = await db
    .update(soapNote)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(soapNote.id, id)))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "SOAP note not found" });
  return rows[0];
}

export async function signSoapNote(id: number) {
  const rows = await db
    .update(soapNote)
    .set({ status: "SIGNED", signedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(soapNote.id, id), eq(soapNote.status, "COMPLETED")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "SOAP note not found or not in COMPLETED status",
    });
  return rows[0];
}

export async function completeSoapNote(id: number) {
  const rows = await db
    .update(soapNote)
    .set({ status: "COMPLETED", updatedAt: new Date() })
    .where(and(eq(soapNote.id, id), eq(soapNote.status, "DRAFT")))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "SOAP note not found or not in DRAFT status",
    });
  return rows[0];
}
