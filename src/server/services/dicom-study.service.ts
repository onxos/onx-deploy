/**
 * OCMBR Wave 4 — D10-S06 IU-SVC
 * DICOM Viewer Hooks (PACS) service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { dicomStudy, type NewDicomStudy } from "@/server/db/schema";

export function listDicomStudiesByImagingRequest(imagingRequestId: number) {
  return db
    .select()
    .from(dicomStudy)
    .where(eq(dicomStudy.imagingRequestId, imagingRequestId))
    .orderBy(dicomStudy.studyDate);
}

export function getDicomStudyById(id: number) {
  return db.select().from(dicomStudy).where(eq(dicomStudy.id, id));
}

export function getDicomStudyByUid(studyUid: string) {
  return db.select().from(dicomStudy).where(eq(dicomStudy.studyUid, studyUid));
}

export async function createDicomStudy(
  input: Omit<NewDicomStudy, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(dicomStudy).values(input).returning();
  return row;
}

export async function updateDicomStudyStatus(id: number, status: string) {
  const [row] = await db
    .update(dicomStudy)
    .set({ status, updatedAt: new Date() })
    .where(eq(dicomStudy.id, id))
    .returning();
  return row;
}
