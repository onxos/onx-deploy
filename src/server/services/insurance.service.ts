/**
 * OCMBR Wave 1 — D06-S01 Service Layer
 * Insurance Service: Insurance Company Master
 * IU-ID: D06-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewInsuranceCompany } from "@/server/db/schema/insurance-foundation";
import { insuranceCompany } from "@/server/db/schema/insurance-foundation";

export async function listInsuranceCompanies(opts?: {
  status?: string;
  branchId?: number;
  search?: string;
}) {
  const conditions = [];
  if (opts?.status) conditions.push(eq(insuranceCompany.status, opts.status));
  if (opts?.branchId !== undefined)
    conditions.push(eq(insuranceCompany.branchId, opts.branchId));
  if (opts?.search)
    conditions.push(ilike(insuranceCompany.name, `%${opts.search}%`));
  const q = db.select().from(insuranceCompany);
  return conditions.length > 0 ? q.where(and(...conditions)) : q;
}

export async function getInsuranceCompanyById(id: number) {
  const [row] = await db
    .select()
    .from(insuranceCompany)
    .where(eq(insuranceCompany.id, id));
  return row ?? null;
}

export async function createInsuranceCompany(
  input: Omit<NewInsuranceCompany, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: insuranceCompany.id })
    .from(insuranceCompany)
    .where(eq(insuranceCompany.code, input.code));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Insurance company code already exists",
    });
  const [result] = await db.insert(insuranceCompany).values(input).returning();
  return result;
}

export async function updateInsuranceCompany(
  id: number,
  input: Partial<Omit<NewInsuranceCompany, "id" | "createdAt">>,
) {
  const rows = await db
    .update(insuranceCompany)
    .set(input)
    .where(eq(insuranceCompany.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Insurance company not found",
    });
  return rows[0];
}
