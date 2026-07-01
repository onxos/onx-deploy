/**
 * OCMBR Wave 2f — D09-S07 IU-SVC
 * Surgical Theatre Management service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewSurgicalCase,
  type NewTheatreTeamMember,
  surgicalCase,
  theatreTeamMember,
} from "@/server/db/schema";

export function listCases(branchId: number) {
  return db
    .select()
    .from(surgicalCase)
    .where(eq(surgicalCase.branchId, branchId))
    .orderBy(surgicalCase.theatreDate);
}

export function getCaseById(id: number) {
  return db.select().from(surgicalCase).where(eq(surgicalCase.id, id));
}

export async function createCase(
  input: NewSurgicalCase,
  teamMembers: Omit<NewTheatreTeamMember, "caseId">[],
) {
  return db.transaction(async (tx) => {
    const [sc] = await tx.insert(surgicalCase).values(input).returning();
    if (teamMembers.length > 0) {
      await tx
        .insert(theatreTeamMember)
        .values(teamMembers.map((m) => ({ ...m, caseId: sc.id })));
    }
    return sc;
  });
}

export function getTeamMembers(caseId: number) {
  return db
    .select()
    .from(theatreTeamMember)
    .where(eq(theatreTeamMember.caseId, caseId));
}

export async function startCase(id: number) {
  const [result] = await db
    .update(surgicalCase)
    .set({
      status: "IN_PROGRESS",
      actualStart: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(surgicalCase.id, id))
    .returning();
  return result;
}

export async function completeCase(id: number, postOpNotes?: string) {
  const [result] = await db
    .update(surgicalCase)
    .set({
      status: "COMPLETED",
      actualEnd: new Date(),
      postOpNotes: postOpNotes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(surgicalCase.id, id))
    .returning();
  return result;
}

export async function cancelCase(id: number) {
  const [result] = await db
    .update(surgicalCase)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(surgicalCase.id, id))
    .returning();
  return result;
}
