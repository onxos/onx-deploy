/**
 * OCMBR Foundation P0 — FOUND-IU-02 Service Layer
 * Tenant Service: Tenant CRUD + config + invite management
 *
 * Business rules:
 * - Tenant code must be unique across the platform
 * - Tenant domain must be unique if provided
 * - Only founder may create tenants
 * - Admin may read tenant config within their tenant context
 * - Invite tokens expire after 48 hours
 *
 * OCMBR Reference: FOUND-IU-02 (D15-S03) — Service layer
 */

import { randomBytes } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db } from "@/server/db";
import { brand } from "@/server/db/schema/org-foundation";
import type { NewTenant } from "@/server/db/schema/tenant-foundation";
import {
  tenant,
  tenantBrand,
  tenantConfig,
  tenantInvite,
} from "@/server/db/schema/tenant-foundation";

// ── Tenant ───────────────────────────────────────────────────────────────────

export async function listTenants(activeOnly = true) {
  return activeOnly
    ? db.select().from(tenant).where(eq(tenant.isActive, true))
    : db.select().from(tenant);
}

export async function getTenantById(id: number) {
  const rows = await db.select().from(tenant).where(eq(tenant.id, id));
  return rows[0] ?? null;
}

export async function getTenantByCode(code: string) {
  const rows = await db.select().from(tenant).where(eq(tenant.code, code));
  return rows[0] ?? null;
}

export async function createTenant(
  input: Omit<NewTenant, "id" | "createdAt" | "updatedAt">,
) {
  const codeConflict = await db
    .select({ id: tenant.id })
    .from(tenant)
    .where(eq(tenant.code, input.code));
  if (codeConflict.length > 0) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Tenant code already exists",
    });
  }
  if (input.domain) {
    const domainConflict = await db
      .select({ id: tenant.id })
      .from(tenant)
      .where(eq(tenant.domain, input.domain));
    if (domainConflict.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Tenant domain already registered",
      });
    }
  }
  const rows = await db.insert(tenant).values(input).returning();
  const [newTenant] = rows;
  if (!newTenant)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Insert failed",
    });
  // Auto-create default config for new tenant
  await db.insert(tenantConfig).values({ tenantId: newTenant.id });
  return newTenant;
}

export async function updateTenant(
  id: number,
  input: Partial<Omit<NewTenant, "id" | "createdAt">>,
) {
  const rows = await db
    .update(tenant)
    .set(input)
    .where(eq(tenant.id, id))
    .returning();
  if (rows.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
  }
  return rows[0];
}

// ── Tenant ↔ Brand association ───────────────────────────────────────────────

export async function assignBrandToTenant(input: {
  tenantId: number;
  brandId: number;
  isPrimary?: boolean;
}) {
  const { tenantId, brandId } = input;
  const tenantRow = await getTenantById(tenantId);
  if (!tenantRow)
    throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
  const brandRows = await db
    .select({ id: brand.id })
    .from(brand)
    .where(eq(brand.id, brandId));
  if (brandRows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Brand not found" });
  const existing = await db
    .select({ id: tenantBrand.id })
    .from(tenantBrand)
    .where(
      and(eq(tenantBrand.tenantId, tenantId), eq(tenantBrand.brandId, brandId)),
    );
  if (existing.length > 0) return existing[0];
  const [result] = await db
    .insert(tenantBrand)
    .values({ tenantId, brandId })
    .returning();
  return result;
}

export async function getTenantBrands(tenantId: number) {
  return db
    .select()
    .from(tenantBrand)
    .where(eq(tenantBrand.tenantId, tenantId));
}

// ── Invite ───────────────────────────────────────────────────────────────────

export async function createInvite(input: {
  tenantId: number;
  email: string;
  role?: string;
}) {
  const { tenantId, email, role = "operator" } = input;
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
  const id = randomBytes(16).toString("hex");
  const [result] = await db
    .insert(tenantInvite)
    .values({ id, tenantId, email, role, token, expiresAt })
    .returning();
  if (!result)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Insert failed",
    });
  return result;
}

export async function validateInviteToken(token: string) {
  const rows = await db
    .select()
    .from(tenantInvite)
    .where(
      and(
        eq(tenantInvite.token, token),
        gt(tenantInvite.expiresAt, new Date()),
        isNull(tenantInvite.acceptedAt),
      ),
    );
  return rows[0] ?? null;
}

export async function acceptInvite(token: string) {
  const invite = await validateInviteToken(token);
  if (!invite) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid or expired invite token",
    });
  }
  await db
    .update(tenantInvite)
    .set({ acceptedAt: new Date() })
    .where(eq(tenantInvite.token, token));
  return invite;
}

export async function cleanupExpiredInvites() {
  return db
    .delete(tenantInvite)
    .where(
      and(
        lt(tenantInvite.expiresAt, new Date()),
        isNull(tenantInvite.acceptedAt),
      ),
    );
}
