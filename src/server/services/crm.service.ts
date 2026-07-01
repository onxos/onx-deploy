/**
 * OCMBR Wave 1 — D07-S01 Service Layer
 * CRM Service: Client + Pet management
 * IU-ID: D07-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewClient, NewPet } from "@/server/db/schema/crm-foundation";
import { client, pet } from "@/server/db/schema/crm-foundation";

// ── Client ────────────────────────────────────────────────────────────────────

export async function listClients(
  branchId: number,
  opts?: { search?: string; activeOnly?: boolean; limit?: number },
) {
  const conditions = [eq(client.branchId, branchId)];
  if (opts?.activeOnly !== false) conditions.push(eq(client.isActive, true));
  if (opts?.search) {
    const searchClause = or(
      ilike(client.firstName, `%${opts.search}%`),
      ilike(client.lastName, `%${opts.search}%`),
      ilike(client.phone, `%${opts.search}%`),
    );
    if (searchClause) conditions.push(searchClause);
  }
  return db
    .select()
    .from(client)
    .where(and(...conditions))
    .limit(opts?.limit ?? 100);
}

export async function getClientById(id: number) {
  const [row] = await db.select().from(client).where(eq(client.id, id));
  return row ?? null;
}

export async function createClient(
  input: Omit<NewClient, "id" | "createdAt" | "updatedAt">,
) {
  const [result] = await db.insert(client).values(input).returning();
  return result;
}

export async function updateClient(
  id: number,
  input: Partial<Omit<NewClient, "id" | "createdAt">>,
) {
  const rows = await db
    .update(client)
    .set(input)
    .where(eq(client.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
  return rows[0];
}

export async function deactivateClient(id: number) {
  const rows = await db
    .update(client)
    .set({ isActive: false })
    .where(eq(client.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
  return rows[0];
}

// ── Pet ───────────────────────────────────────────────────────────────────────

export async function listPets(opts: {
  clientId?: number;
  branchId?: number;
  activeOnly?: boolean;
}) {
  const conditions = [];
  if (opts.clientId) conditions.push(eq(pet.clientId, opts.clientId));
  if (opts.branchId) conditions.push(eq(pet.branchId, opts.branchId));
  if (opts.activeOnly !== false) conditions.push(eq(pet.isActive, true));
  return conditions.length > 0
    ? db
        .select()
        .from(pet)
        .where(and(...conditions))
    : db.select().from(pet);
}

export async function getPetById(id: number) {
  const [row] = await db.select().from(pet).where(eq(pet.id, id));
  return row ?? null;
}

export async function createPet(
  input: Omit<NewPet, "id" | "createdAt" | "updatedAt">,
) {
  const owner = await getClientById(input.clientId);
  if (!owner)
    throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
  if (!owner.isActive)
    throw new TRPCError({ code: "BAD_REQUEST", message: "Client is inactive" });
  if (input.microchipNumber) {
    const [dup] = await db
      .select({ id: pet.id })
      .from(pet)
      .where(eq(pet.microchipNumber, input.microchipNumber));
    if (dup)
      throw new TRPCError({
        code: "CONFLICT",
        message: "Microchip number already registered",
      });
  }
  const [result] = await db.insert(pet).values(input).returning();
  return result;
}

export async function updatePet(
  id: number,
  input: Partial<Omit<NewPet, "id" | "createdAt">>,
) {
  const rows = await db
    .update(pet)
    .set(input)
    .where(eq(pet.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
  return rows[0];
}
