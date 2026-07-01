/**
 * OCMBR Wave 2 — D06-S02 IU-API (Service)
 * Insurance Policy & Coverage Register service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  InsurancePolicy,
  NewInsurancePolicy,
} from "@/server/db/schema/insurance-policy-foundation";
import { insurancePolicy } from "@/server/db/schema/insurance-policy-foundation";

export async function listInsurancePolicies(opts?: {
  branchId?: number;
  clientId?: number;
  petId?: number;
  status?: string;
}) {
  const conditions = [];
  if (opts?.branchId)
    conditions.push(eq(insurancePolicy.branchId, opts.branchId));
  if (opts?.clientId)
    conditions.push(eq(insurancePolicy.clientId, opts.clientId));
  if (opts?.petId) conditions.push(eq(insurancePolicy.petId, opts.petId));
  if (opts?.status) conditions.push(eq(insurancePolicy.status, opts.status));
  if (conditions.length === 0)
    return db
      .select()
      .from(insurancePolicy)
      .orderBy(desc(insurancePolicy.createdAt));
  return db
    .select()
    .from(insurancePolicy)
    .where(and(...conditions))
    .orderBy(desc(insurancePolicy.createdAt));
}

export async function getInsurancePolicyById(id: number) {
  const rows = await db
    .select()
    .from(insurancePolicy)
    .where(eq(insurancePolicy.id, id));
  return rows[0] ?? null;
}

export async function createInsurancePolicy(
  input: Omit<NewInsurancePolicy, "id" | "createdAt" | "updatedAt">,
) {
  const existing = await db
    .select({ id: insurancePolicy.id })
    .from(insurancePolicy)
    .where(eq(insurancePolicy.policyNumber, input.policyNumber));
  if (existing.length > 0)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Policy number already exists",
    });
  const [result] = await db.insert(insurancePolicy).values(input).returning();
  return result;
}

export async function updateInsurancePolicy(
  id: number,
  input: Partial<
    Omit<
      NewInsurancePolicy,
      "id" | "createdAt" | "insuranceCompanyId" | "petId"
    >
  >,
) {
  if (input.policyNumber) {
    const conflict = await db
      .select({ id: insurancePolicy.id })
      .from(insurancePolicy)
      .where(
        and(
          eq(insurancePolicy.policyNumber, input.policyNumber),
          ne(insurancePolicy.id, id),
        ),
      );
    if (conflict.length > 0)
      throw new TRPCError({
        code: "CONFLICT",
        message: "Policy number in use",
      });
  }
  const rows = await db
    .update(insurancePolicy)
    .set(input)
    .where(eq(insurancePolicy.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Policy not found" });
  return rows[0] as InsurancePolicy;
}

export async function cancelInsurancePolicy(id: number) {
  return updateInsurancePolicy(id, { status: "CANCELLED" });
}
