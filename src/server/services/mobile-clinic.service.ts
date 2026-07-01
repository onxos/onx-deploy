/**
 * OCMBR Wave 5 — D11-S03 IU-SVC
 * Mobile Clinic Schedule & Route service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  mobileClinicRoute,
  mobileClinicStop,
  type NewMobileClinicRoute,
  type NewMobileClinicStop,
} from "@/server/db/schema";

export function listRoutesByBranch(branchId: number) {
  return db
    .select()
    .from(mobileClinicRoute)
    .where(eq(mobileClinicRoute.branchId, branchId))
    .orderBy(mobileClinicRoute.scheduledDate);
}

export function getRouteById(id: number) {
  return db
    .select()
    .from(mobileClinicRoute)
    .where(eq(mobileClinicRoute.id, id));
}

export async function createRoute(
  input: Omit<NewMobileClinicRoute, "id" | "createdAt" | "updatedAt">,
  stops: Omit<NewMobileClinicStop, "routeId" | "id" | "createdAt">[],
) {
  return db.transaction(async (tx) => {
    const [route] = await tx
      .insert(mobileClinicRoute)
      .values(input)
      .returning();
    if (stops.length > 0) {
      await tx
        .insert(mobileClinicStop)
        .values(stops.map((s) => ({ ...s, routeId: route.id })));
    }
    return route;
  });
}

export function listStopsByRoute(routeId: number) {
  return db
    .select()
    .from(mobileClinicStop)
    .where(eq(mobileClinicStop.routeId, routeId))
    .orderBy(mobileClinicStop.stopOrder);
}

export async function updateRouteStatus(id: number, status: string) {
  const [row] = await db
    .update(mobileClinicRoute)
    .set({ status, updatedAt: new Date() })
    .where(eq(mobileClinicRoute.id, id))
    .returning();
  return row;
}
