/**
 * OCMBR Wave 7 — D13-S01 IU-SVC
 * Continuing Education & Training Records service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewTrainingCourse,
  type NewTrainingRecord,
  trainingCourse,
  trainingRecord,
} from "@/server/db/schema";

export function listCourses() {
  return db
    .select()
    .from(trainingCourse)
    .where(eq(trainingCourse.isActive, true));
}

export async function createCourse(
  input: Omit<NewTrainingCourse, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(trainingCourse).values(input).returning();
  return row;
}

export function listRecordsByStaff(staffId: string) {
  return db
    .select()
    .from(trainingRecord)
    .where(eq(trainingRecord.staffId, staffId))
    .orderBy(trainingRecord.createdAt);
}

export function listRecordsByCourse(courseId: number) {
  return db
    .select()
    .from(trainingRecord)
    .where(eq(trainingRecord.courseId, courseId));
}

export async function enrollStaff(
  input: Omit<NewTrainingRecord, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(trainingRecord).values(input).returning();
  return row;
}

export async function completeTraining(
  id: number,
  completedDate: string,
  score?: number,
) {
  const [row] = await db
    .update(trainingRecord)
    .set({
      status: "COMPLETED",
      completedDate,
      score: score ?? null,
      updatedAt: new Date(),
    })
    .where(eq(trainingRecord.id, id))
    .returning();
  return row;
}
