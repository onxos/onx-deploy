/**
 * OCMBR Wave 1 — D04-S01 Service Layer
 * Procurement Service: Vendor Master & Qualification
 * IU-ID: D04-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewVendor } from "@/server/db/schema/procurement-foundation";
import { vendor } from "@/server/db/schema/procurement-foundation";

export async function listVendors(opts?: {
  search?: string;
  status?: string;
  qualificationStatus?: string;
  vendorType?: string;
  branchId?: number;
  limit?: number;
}) {
  const conditions = [];
  if (opts?.status) conditions.push(eq(vendor.status, opts.status));
  if (opts?.qualificationStatus)
    conditions.push(eq(vendor.qualificationStatus, opts.qualificationStatus));
  if (opts?.vendorType) conditions.push(eq(vendor.vendorType, opts.vendorType));
  if (opts?.branchId) conditions.push(eq(vendor.branchId, opts.branchId));
  if (opts?.search) {
    const searchClause = or(
      ilike(vendor.name, `%${opts.search}%`),
      ilike(vendor.code, `%${opts.search}%`),
    );
    if (searchClause) conditions.push(searchClause);
  }
  const q = db
    .select()
    .from(vendor)
    .limit(opts?.limit ?? 100);
  return conditions.length > 0 ? q.where(and(...conditions)) : q;
}

export async function getVendorById(id: number) {
  const [row] = await db.select().from(vendor).where(eq(vendor.id, id));
  return row ?? null;
}

export async function createVendor(
  input: Omit<NewVendor, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: vendor.id })
    .from(vendor)
    .where(eq(vendor.code, input.code));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Vendor code already exists",
    });
  const [result] = await db.insert(vendor).values(input).returning();
  return result;
}

export async function updateVendor(
  id: number,
  input: Partial<Omit<NewVendor, "id" | "createdAt">>,
) {
  const rows = await db
    .update(vendor)
    .set(input)
    .where(eq(vendor.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Vendor not found" });
  return rows[0];
}

export async function qualifyVendor(
  id: number,
  status: "APPROVED" | "REJECTED",
) {
  const rows = await db
    .update(vendor)
    .set({ qualificationStatus: status })
    .where(eq(vendor.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Vendor not found" });
  return rows[0];
}
