/**
 * OCMBR Wave 4 — D10-S05 IU-SVC
 * Imaging Request Module service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { imagingRequest, type NewImagingRequest } from "@/server/db/schema";

export function listImagingRequestsByPet(petId: number) {
  return db
    .select()
    .from(imagingRequest)
    .where(eq(imagingRequest.petId, petId))
    .orderBy(imagingRequest.createdAt);
}

export function listImagingRequestsByBranch(branchId: number) {
  return db
    .select()
    .from(imagingRequest)
    .where(eq(imagingRequest.branchId, branchId))
    .orderBy(imagingRequest.createdAt);
}

export function getImagingRequestById(id: number) {
  return db.select().from(imagingRequest).where(eq(imagingRequest.id, id));
}

export async function createImagingRequest(
  input: Omit<NewImagingRequest, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(imagingRequest).values(input).returning();
  return row;
}

export async function updateImagingRequestStatus(id: number, status: string) {
  const [row] = await db
    .update(imagingRequest)
    .set({ status, updatedAt: new Date() })
    .where(eq(imagingRequest.id, id))
    .returning();
  return row;
}

export async function completeImagingRequest(
  id: number,
  reportSummary: string,
) {
  const [row] = await db
    .update(imagingRequest)
    .set({
      status: "COMPLETED",
      completedAt: new Date(),
      reportSummary,
      updatedAt: new Date(),
    })
    .where(eq(imagingRequest.id, id))
    .returning();
  return row;
}
