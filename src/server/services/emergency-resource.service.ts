/**
 * OCMBR Wave 6 — D11-S06 IU-SVC
 * Emergency Resource Dispatch service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  dispatchEvent,
  emergencyResource,
  type NewDispatchEvent,
  type NewEmergencyResource,
} from "@/server/db/schema";

export function listResourcesByBranch(branchId: number) {
  return db
    .select()
    .from(emergencyResource)
    .where(eq(emergencyResource.branchId, branchId));
}

export function getResourceById(id: number) {
  return db
    .select()
    .from(emergencyResource)
    .where(eq(emergencyResource.id, id));
}

export async function createResource(
  input: Omit<NewEmergencyResource, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(emergencyResource).values(input).returning();
  return row;
}

export async function updateResourceStatus(id: number, status: string) {
  const [row] = await db
    .update(emergencyResource)
    .set({ status, updatedAt: new Date() })
    .where(eq(emergencyResource.id, id))
    .returning();
  return row;
}

export async function dispatchResource(
  input: Omit<NewDispatchEvent, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(dispatchEvent).values(input).returning();
  return row;
}

export async function returnResource(id: number) {
  const [row] = await db
    .update(dispatchEvent)
    .set({ returnedAt: new Date(), updatedAt: new Date() })
    .where(eq(dispatchEvent.id, id))
    .returning();
  return row;
}

export function listDispatchEventsByResource(resourceId: number) {
  return db
    .select()
    .from(dispatchEvent)
    .where(eq(dispatchEvent.resourceId, resourceId))
    .orderBy(dispatchEvent.dispatchedAt);
}
