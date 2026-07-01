/**
 * OCMBR Foundation P0 — FOUND-IU-03 Service Layer
 * Branch RBAC Service: user-branch role assignment and permission checks
 *
 * Business rules:
 * - A user may hold multiple branch-scoped roles (one per branch)
 * - Only admin/founder may grant/revoke branch roles
 * - Platform role (operator/admin/founder) takes precedence over branch role
 *   for platform-level resources; branch role applies to domain resources
 * - Revoking a role sets revokedAt timestamp; does not delete the record
 * - branchRolePermission table is seeded with default role → permission maps
 *
 * OCMBR Reference: FOUND-IU-03 (D15-S04) — Service layer
 */

import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import {
  branchRolePermission,
  userBranchRole,
  userTenantMembership,
} from "@/server/db/schema/branch-rbac-foundation";

// ── Branch Role Assignment ────────────────────────────────────────────────────

export async function getUserBranchRoles(userId: string) {
  return db
    .select()
    .from(userBranchRole)
    .where(
      and(eq(userBranchRole.userId, userId), eq(userBranchRole.isActive, true)),
    );
}

export async function getUserRoleInBranch(userId: string, branchId: number) {
  const rows = await db
    .select()
    .from(userBranchRole)
    .where(
      and(
        eq(userBranchRole.userId, userId),
        eq(userBranchRole.branchId, branchId),
        eq(userBranchRole.isActive, true),
        isNull(userBranchRole.revokedAt),
      ),
    );
  return rows[0] ?? null;
}

export async function grantBranchRole(
  userId: string,
  branchId: number,
  role: string,
  grantedBy: string,
) {
  // Revoke any existing active role in the same branch first
  await db
    .update(userBranchRole)
    .set({ isActive: false, revokedAt: new Date() })
    .where(
      and(
        eq(userBranchRole.userId, userId),
        eq(userBranchRole.branchId, branchId),
        eq(userBranchRole.isActive, true),
      ),
    );
  const [result] = await db
    .insert(userBranchRole)
    .values({ userId, branchId, role, grantedBy, isActive: true })
    .returning();
  return result;
}

export async function revokeBranchRole(userId: string, branchId: number) {
  const existing = await getUserRoleInBranch(userId, branchId);
  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No active branch role found",
    });
  }
  const [updated] = await db
    .update(userBranchRole)
    .set({ isActive: false, revokedAt: new Date() })
    .where(eq(userBranchRole.id, existing.id))
    .returning();
  return updated;
}

// ── Tenant Membership ─────────────────────────────────────────────────────────

export async function getUserTenantMemberships(userId: string) {
  return db
    .select()
    .from(userTenantMembership)
    .where(
      and(
        eq(userTenantMembership.userId, userId),
        eq(userTenantMembership.isActive, true),
      ),
    );
}

export async function addUserToTenant(
  userId: string,
  tenantId: number,
  platformRole = "operator",
) {
  const existing = await db
    .select({ id: userTenantMembership.id })
    .from(userTenantMembership)
    .where(
      and(
        eq(userTenantMembership.userId, userId),
        eq(userTenantMembership.tenantId, tenantId),
        eq(userTenantMembership.isActive, true),
      ),
    );
  if (existing.length > 0) return existing[0];
  const [result] = await db
    .insert(userTenantMembership)
    .values({ userId, tenantId, platformRole, isActive: true })
    .returning();
  return result;
}

export async function removeUserFromTenant(userId: string, tenantId: number) {
  const rows = await db
    .update(userTenantMembership)
    .set({ isActive: false })
    .where(
      and(
        eq(userTenantMembership.userId, userId),
        eq(userTenantMembership.tenantId, tenantId),
      ),
    )
    .returning();
  return rows[0] ?? null;
}

// ── Branch Permission Check ───────────────────────────────────────────────────

export async function checkBranchPermission(
  userId: string,
  branchId: number,
  resource: string,
  action: string,
): Promise<boolean> {
  const roleRow = await getUserRoleInBranch(userId, branchId);
  if (!roleRow) return false;
  const permRows = await db
    .select()
    .from(branchRolePermission)
    .where(
      and(
        eq(branchRolePermission.role, roleRow.role),
        eq(branchRolePermission.resource, resource),
        eq(branchRolePermission.action, action),
        eq(branchRolePermission.isAllowed, true),
      ),
    );
  return permRows.length > 0;
}

// ── Default role permission seed ──────────────────────────────────────────────

export const DEFAULT_BRANCH_ROLE_PERMISSIONS = [
  // branch-manager: full local management
  { role: "branch-manager", resource: "employees", action: "read" },
  { role: "branch-manager", resource: "employees", action: "write" },
  { role: "branch-manager", resource: "inventory", action: "read" },
  { role: "branch-manager", resource: "inventory", action: "write" },
  { role: "branch-manager", resource: "clinical", action: "read" },
  { role: "branch-manager", resource: "reports", action: "read" },
  // vet: clinical access
  { role: "vet", resource: "clinical", action: "read" },
  { role: "vet", resource: "clinical", action: "write" },
  { role: "vet", resource: "prescriptions", action: "write" },
  // receptionist: appointment + POS
  { role: "receptionist", resource: "appointments", action: "read" },
  { role: "receptionist", resource: "appointments", action: "write" },
  { role: "receptionist", resource: "pos", action: "read" },
  { role: "receptionist", resource: "pos", action: "write" },
  // pharmacist: pharmacy stock
  { role: "pharmacist", resource: "pharmacy", action: "read" },
  { role: "pharmacist", resource: "pharmacy", action: "write" },
  { role: "pharmacist", resource: "prescriptions", action: "read" },
  // staff: read-only
  { role: "staff", resource: "employees", action: "read" },
  { role: "staff", resource: "clinical", action: "read" },
] as const;

export async function seedDefaultBranchPermissions() {
  const existing = await db
    .select({ id: branchRolePermission.id })
    .from(branchRolePermission);
  if (existing.length > 0) return { seeded: false, reason: "already_seeded" };
  await db
    .insert(branchRolePermission)
    .values(
      DEFAULT_BRANCH_ROLE_PERMISSIONS.map((p) => ({ ...p, isAllowed: true })),
    );
  return { seeded: true, count: DEFAULT_BRANCH_ROLE_PERMISSIONS.length };
}
