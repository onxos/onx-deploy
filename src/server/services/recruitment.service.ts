/**
 * OCMBR Wave 2e — D02-S02 IU-SVC
 * Recruitment & Onboarding service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  jobApplication,
  jobPosting,
  type NewJobApplication,
  type NewJobPosting,
  type NewOnboardingTask,
  onboardingTask,
} from "@/server/db/schema";

export function listPostings(branchId: number) {
  return db
    .select()
    .from(jobPosting)
    .where(eq(jobPosting.branchId, branchId))
    .orderBy(jobPosting.createdAt);
}

export function getPostingById(id: number) {
  return db.select().from(jobPosting).where(eq(jobPosting.id, id));
}

export async function createPosting(input: NewJobPosting) {
  const [result] = await db.insert(jobPosting).values(input).returning();
  return result;
}

export async function closePosting(id: number) {
  const [result] = await db
    .update(jobPosting)
    .set({ status: "CLOSED", updatedAt: new Date() })
    .where(eq(jobPosting.id, id))
    .returning();
  return result;
}

export function listApplications(postingId: number) {
  return db
    .select()
    .from(jobApplication)
    .where(eq(jobApplication.postingId, postingId))
    .orderBy(jobApplication.appliedAt);
}

export async function createApplication(input: NewJobApplication) {
  const [result] = await db.insert(jobApplication).values(input).returning();
  return result;
}

export async function updateApplicationStatus(
  id: number,
  status: string,
  notes: string,
) {
  const [result] = await db
    .update(jobApplication)
    .set({ status, notes, updatedAt: new Date() })
    .where(eq(jobApplication.id, id))
    .returning();
  return result;
}

export function listOnboardingTasks(employeeId: number) {
  return db
    .select()
    .from(onboardingTask)
    .where(eq(onboardingTask.employeeId, employeeId));
}

export async function createOnboardingTask(input: NewOnboardingTask) {
  const [result] = await db.insert(onboardingTask).values(input).returning();
  return result;
}

export async function completeOnboardingTask(id: number) {
  const [result] = await db
    .update(onboardingTask)
    .set({ status: "DONE", completedAt: new Date(), updatedAt: new Date() })
    .where(eq(onboardingTask.id, id))
    .returning();
  return result;
}
