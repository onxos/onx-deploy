/**
 * OCMBR Foundation P0 — FOUND-IU-01 Service Layer
 * Org Service: Brand + Branch CRUD
 *
 * Business rules:
 * - A brand must exist before a branch can be created
 * - Branch code must be unique across the platform
 * - Only admin/founder may create/update/delete brands and branches
 * - Deactivating a brand deactivates all its branches
 * - HQ branch: only one per brand may be marked as headquarters
 *
 * OCMBR Reference: FOUND-IU-01 (D15-S01, D15-S02) — Service layer
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewBranch, NewBrand } from "@/server/db/schema/org-foundation";
import { branch, brand } from "@/server/db/schema/org-foundation";

// ── Brand ────────────────────────────────────────────────────────────────────

export async function listBrands(activeOnly = true) {
  if (activeOnly) {
    return db.select().from(brand).where(eq(brand.isActive, true));
  }
  return db.select().from(brand);
}

export async function getBrandById(id: number) {
  const rows = await db.select().from(brand).where(eq(brand.id, id));
  return rows[0] ?? null;
}

export async function createBrand(
  input: Omit<NewBrand, "id" | "createdAt" | "updatedAt">,
) {
  const existing = await db
    .select({ id: brand.id })
    .from(brand)
    .where(eq(brand.code, input.code));
  if (existing.length > 0) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Brand code already exists",
    });
  }
  const [result] = await db.insert(brand).values(input).returning();
  return result;
}

export async function updateBrand(
  id: number,
  input: Partial<Omit<NewBrand, "id" | "createdAt">>,
) {
  if (input.code) {
    const conflict = await db
      .select({ id: brand.id })
      .from(brand)
      .where(and(eq(brand.code, input.code), ne(brand.id, id)));
    if (conflict.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Brand code already in use",
      });
    }
  }
  const rows = await db
    .update(brand)
    .set(input)
    .where(eq(brand.id, id))
    .returning();
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Brand not found" });
  }
  return rows[0];
}

export async function deactivateBrand(id: number) {
  // Deactivate brand and all its branches
  await db
    .update(branch)
    .set({ isActive: false })
    .where(eq(branch.brandId, id));
  const rows = await db
    .update(brand)
    .set({ isActive: false })
    .where(eq(brand.id, id))
    .returning();
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Brand not found" });
  }
  return rows[0];
}

// ── Branch ───────────────────────────────────────────────────────────────────

export async function listBranches(brandId?: number, activeOnly = true) {
  const conditions = activeOnly ? [eq(branch.isActive, true)] : [];
  if (brandId !== undefined) {
    conditions.push(eq(branch.brandId, brandId));
  }
  return conditions.length > 0
    ? db
        .select()
        .from(branch)
        .where(and(...conditions))
    : db.select().from(branch);
}

export async function getBranchById(id: number) {
  const rows = await db.select().from(branch).where(eq(branch.id, id));
  return rows[0] ?? null;
}

export async function createBranch(
  input: Omit<NewBranch, "id" | "createdAt" | "updatedAt">,
) {
  // Validate brand exists
  const parentBrand = await getBrandById(input.brandId);
  if (!parentBrand) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Brand not found" });
  }
  if (!parentBrand.isActive) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot add branch to inactive brand",
    });
  }
  // Unique code check
  const existing = await db
    .select({ id: branch.id })
    .from(branch)
    .where(eq(branch.code, input.code));
  if (existing.length > 0) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Branch code already exists",
    });
  }
  // Enforce single HQ per brand
  if (input.isHeadquarters) {
    await db
      .update(branch)
      .set({ isHeadquarters: false })
      .where(
        and(eq(branch.brandId, input.brandId), eq(branch.isHeadquarters, true)),
      );
  }
  const [result] = await db.insert(branch).values(input).returning();
  return result;
}

export async function updateBranch(
  id: number,
  input: Partial<Omit<NewBranch, "id" | "createdAt">>,
) {
  const existing = await getBranchById(id);
  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Branch not found" });
  }
  if (input.code && input.code !== existing.code) {
    const conflict = await db
      .select({ id: branch.id })
      .from(branch)
      .where(and(eq(branch.code, input.code), ne(branch.id, id)));
    if (conflict.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Branch code already in use",
      });
    }
  }
  if (input.isHeadquarters) {
    await db
      .update(branch)
      .set({ isHeadquarters: false })
      .where(
        and(
          eq(branch.brandId, existing.brandId),
          eq(branch.isHeadquarters, true),
          ne(branch.id, id),
        ),
      );
  }
  const rows = await db
    .update(branch)
    .set(input)
    .where(eq(branch.id, id))
    .returning();
  return rows[0];
}
