import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewDisciplinaryCase,
  NewEmployeeSelfServiceRequest,
  NewEscalationLog,
  NewFounderSeal,
  NewStrategicObjective,
} from "@/server/db/schema/governance-foundation";
import {
  disciplinaryCase,
  employeeSelfServiceRequest,
  escalationLog,
  founderSeal,
  strategicObjective,
} from "@/server/db/schema/governance-foundation";

// D01-S05 OKR
export const listObjectives = (period?: string) =>
  period
    ? db
        .select()
        .from(strategicObjective)
        .where(eq(strategicObjective.period, period))
    : db.select().from(strategicObjective);

export async function createObjective(
  input: Omit<NewStrategicObjective, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(strategicObjective).values(input).returning();
  return row;
}

export async function updateObjectiveProgress(
  id: number,
  currentValue: string,
  progress: string,
  status: string,
) {
  const [row] = await db
    .update(strategicObjective)
    .set({ currentValue, progress, status, updatedAt: new Date() })
    .where(eq(strategicObjective.id, id))
    .returning();
  return row;
}

// D01-S06 Escalation
export const listEscalations = (status?: string) =>
  status
    ? db.select().from(escalationLog).where(eq(escalationLog.status, status))
    : db.select().from(escalationLog);

export async function createEscalation(
  input: Omit<NewEscalationLog, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(escalationLog).values(input).returning();
  return row;
}

export async function resolveEscalation(id: number, resolution: string) {
  const [row] = await db
    .update(escalationLog)
    .set({
      resolution,
      status: "RESOLVED",
      resolvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(escalationLog.id, id))
    .returning();
  return row;
}

// D01-S07 Founder Seal
export const listSeals = (documentType?: string) =>
  documentType
    ? db
        .select()
        .from(founderSeal)
        .where(eq(founderSeal.documentType, documentType))
    : db.select().from(founderSeal);

export async function createSeal(
  input: Omit<NewFounderSeal, "id" | "createdAt">,
) {
  const [row] = await db.insert(founderSeal).values(input).returning();
  return row;
}

// D02-S08 Disciplinary
export const listDisciplinaryCases = (employeeId?: string) =>
  employeeId
    ? db
        .select()
        .from(disciplinaryCase)
        .where(eq(disciplinaryCase.employeeId, employeeId))
    : db.select().from(disciplinaryCase);

export async function createDisciplinaryCase(
  input: Omit<NewDisciplinaryCase, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(disciplinaryCase).values(input).returning();
  return row;
}

export async function resolveDisciplinaryCase(id: number, outcome: string) {
  const [row] = await db
    .update(disciplinaryCase)
    .set({
      outcome,
      status: "RESOLVED",
      resolvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(disciplinaryCase.id, id))
    .returning();
  return row;
}

// D02-S09 ESS
export const listEssRequests = (employeeId?: string) =>
  employeeId
    ? db
        .select()
        .from(employeeSelfServiceRequest)
        .where(eq(employeeSelfServiceRequest.employeeId, employeeId))
    : db.select().from(employeeSelfServiceRequest);

export async function createEssRequest(
  input: Omit<NewEmployeeSelfServiceRequest, "id" | "createdAt">,
) {
  const [row] = await db
    .insert(employeeSelfServiceRequest)
    .values(input)
    .returning();
  return row;
}

export async function processEssRequest(
  id: number,
  status: "APPROVED" | "REJECTED",
  approvedBy?: string,
  rejectionReason?: string,
) {
  const [row] = await db
    .update(employeeSelfServiceRequest)
    .set({ status, approvedBy, rejectionReason, processedAt: new Date() })
    .where(eq(employeeSelfServiceRequest.id, id))
    .returning();
  return row;
}
