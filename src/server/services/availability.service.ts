/**
 * OCMBR Wave 6 — D11-S08 IU-SVC
 * 24/7 Availability Dashboard service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  availabilityOverride,
  availabilityWindow,
  type NewAvailabilityOverride,
  type NewAvailabilityWindow,
} from "@/server/db/schema";

export function listWindowsByBranch(branchId: number) {
  return db
    .select()
    .from(availabilityWindow)
    .where(eq(availabilityWindow.branchId, branchId))
    .orderBy(availabilityWindow.dayOfWeek);
}

export async function upsertWindow(
  input: Omit<NewAvailabilityWindow, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(availabilityWindow).values(input).returning();
  return row;
}

export async function updateWindowStatus(id: number, isActive: boolean) {
  const [row] = await db
    .update(availabilityWindow)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(availabilityWindow.id, id))
    .returning();
  return row;
}

export function listOverridesByBranch(branchId: number) {
  return db
    .select()
    .from(availabilityOverride)
    .where(eq(availabilityOverride.branchId, branchId))
    .orderBy(availabilityOverride.overrideDate);
}

export async function createOverride(
  input: Omit<NewAvailabilityOverride, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(availabilityOverride).values(input).returning();
  return row;
}
