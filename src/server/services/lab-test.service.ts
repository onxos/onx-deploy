/**
 * OCMBR Wave 3 — D10-S01 IU-SVC
 * Lab Test Request & Result Entry service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { labTestRequest, type NewLabTestRequest } from "@/server/db/schema";

export function listLabTestsByPet(petId: number) {
  return db
    .select()
    .from(labTestRequest)
    .where(eq(labTestRequest.petId, petId))
    .orderBy(labTestRequest.requestedAt);
}

export function listLabTestsByBranch(branchId: number) {
  return db
    .select()
    .from(labTestRequest)
    .where(eq(labTestRequest.branchId, branchId))
    .orderBy(labTestRequest.requestedAt);
}

export function getLabTestById(id: number) {
  return db.select().from(labTestRequest).where(eq(labTestRequest.id, id));
}

export async function createLabTestRequest(
  input: Omit<NewLabTestRequest, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(labTestRequest).values(input).returning();
  return row;
}

export async function updateLabTestStatus(id: number, status: string) {
  const [row] = await db
    .update(labTestRequest)
    .set({ status, updatedAt: new Date() })
    .where(eq(labTestRequest.id, id))
    .returning();
  return row;
}

export async function recordLabResult(
  id: number,
  resultSummary: string,
  resultData?: unknown,
) {
  const [row] = await db
    .update(labTestRequest)
    .set({
      status: "COMPLETED",
      resultSummary,
      resultData: resultData ?? null,
      resultDate: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(labTestRequest.id, id))
    .returning();
  return row;
}
