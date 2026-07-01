/**
 * OCMBR Wave 2b — D05-S02 IU-SVC
 * Inventory Location service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  inventoryLocation,
  type NewInventoryLocation,
} from "@/server/db/schema";

export async function listInventoryLocations(
  branchId: number,
  opts?: { activeOnly?: boolean },
) {
  const conditions = [eq(inventoryLocation.branchId, branchId)];
  if (opts?.activeOnly !== false)
    conditions.push(eq(inventoryLocation.isActive, true));
  return db
    .select()
    .from(inventoryLocation)
    .where(and(...conditions))
    .orderBy(inventoryLocation.code);
}

export async function getInventoryLocationById(id: number) {
  const rows = await db
    .select()
    .from(inventoryLocation)
    .where(eq(inventoryLocation.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Inventory location not found",
    });
  return rows[0];
}

export async function createInventoryLocation(
  input: Omit<NewInventoryLocation, "id" | "createdAt">,
) {
  const rows = await db.insert(inventoryLocation).values(input).returning();
  return rows[0];
}

export async function updateInventoryLocation(
  id: number,
  input: Partial<Omit<NewInventoryLocation, "id" | "createdAt" | "branchId">>,
) {
  const rows = await db
    .update(inventoryLocation)
    .set(input)
    .where(eq(inventoryLocation.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Inventory location not found",
    });
  return rows[0];
}

export async function deactivateInventoryLocation(id: number) {
  const rows = await db
    .update(inventoryLocation)
    .set({ isActive: false })
    .where(eq(inventoryLocation.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Inventory location not found",
    });
  return rows[0];
}
