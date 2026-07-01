/**
 * OCMBR Foundation P0 — FOUND-IU-03 API Layer
 * Branch-RBAC Router: Branch-level role and permission management
 *
 * Authorization:
 * - rbac:manage: admin/founder
 * - org:read: read-only permission checks
 *
 * OCMBR Reference: FOUND-IU-03 (D15-S01, D15-S04) — API layer
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { recordAudit } from "@/server/services/audit.service";
import * as rbacService from "@/server/services/branch-rbac.service";
import { publishEvent } from "@/server/services/event-outbox.service";

// ── Router ────────────────────────────────────────────────────────────────────

export const branchRbacRouter = createTRPCRouter({
  // ── Branch Role queries ───────────────────────────────────────────────────

  getUserBranchRoles: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .input(z.object({ userId: z.string().min(1) }))
    .query(({ input }) => rbacService.getUserBranchRoles(input.userId)),

  getUserRoleInBranch: protectedProcedure
    .use(requirePermission("org:read"))
    .input(
      z.object({
        userId: z.string().min(1),
        branchId: z.number().int().positive(),
      }),
    )
    .query(({ input }) =>
      rbacService.getUserRoleInBranch(input.userId, input.branchId),
    ),

  // ── Branch Role mutations ─────────────────────────────────────────────────

  grantBranchRole: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .input(
      z.object({
        userId: z.string().min(1),
        branchId: z.number().int().positive(),
        role: z.string().min(1).max(50),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await rbacService.grantBranchRole(
        input.userId,
        input.branchId,
        input.role,
        ctx.user.id,
      );
      await recordAudit({
        domain: "rbac",
        aggregateType: "UserBranchRole",
        aggregateId: input.userId,
        action: "GRANT_ROLE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: {
          userId: input.userId,
          branchId: input.branchId,
          role: input.role,
        },
        branchId: input.branchId,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "rbac",
        "UserBranchRole",
        input.userId,
        "role.granted",
        {
          userId: input.userId,
          branchId: input.branchId,
          role: input.role,
        },
      );
      return result;
    }),

  revokeBranchRole: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .input(
      z.object({
        userId: z.string().min(1),
        branchId: z.number().int().positive(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await rbacService.revokeBranchRole(input.userId, input.branchId);
      await recordAudit({
        domain: "rbac",
        aggregateType: "UserBranchRole",
        aggregateId: input.userId,
        action: "REVOKE_ROLE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        context: { userId: input.userId, branchId: input.branchId },
        branchId: input.branchId,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "rbac",
        "UserBranchRole",
        input.userId,
        "role.revoked",
        {
          userId: input.userId,
          branchId: input.branchId,
        },
      );
      return { success: true };
    }),

  // ── Tenant membership ─────────────────────────────────────────────────────

  getUserTenantMemberships: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .input(z.object({ userId: z.string().min(1) }))
    .query(({ input }) => rbacService.getUserTenantMemberships(input.userId)),

  addUserToTenant: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .input(
      z.object({
        userId: z.string().min(1),
        tenantId: z.number().int().positive(),
        platformRole: z.string().min(1).max(50).default("member"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await rbacService.addUserToTenant(
        input.userId,
        input.tenantId,
        input.platformRole,
      );
      await recordAudit({
        domain: "rbac",
        aggregateType: "TenantMembership",
        aggregateId: input.userId,
        action: "ADD_TO_TENANT",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: {
          userId: input.userId,
          tenantId: input.tenantId,
          role: input.platformRole,
        },
        tenantId: input.tenantId,
        ipAddress: ctx.ip,
      });
      return result;
    }),

  removeUserFromTenant: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .input(
      z.object({
        userId: z.string().min(1),
        tenantId: z.number().int().positive(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await rbacService.removeUserFromTenant(input.userId, input.tenantId);
      await recordAudit({
        domain: "rbac",
        aggregateType: "TenantMembership",
        aggregateId: input.userId,
        action: "REMOVE_FROM_TENANT",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        context: { userId: input.userId, tenantId: input.tenantId },
        tenantId: input.tenantId,
        ipAddress: ctx.ip,
      });
      return { success: true };
    }),

  // ── Permission checks ─────────────────────────────────────────────────────

  checkBranchPermission: protectedProcedure
    .use(requirePermission("org:read"))
    .input(
      z.object({
        userId: z.string().min(1),
        branchId: z.number().int().positive(),
        resource: z.string().min(1),
        action: z.string().min(1),
      }),
    )
    .query(({ input }) =>
      rbacService.checkBranchPermission(
        input.userId,
        input.branchId,
        input.resource,
        input.action,
      ),
    ),

  // ── Seed default permissions ──────────────────────────────────────────────

  seedDefaultPermissions: protectedProcedure
    .use(requirePermission("rbac:manage"))
    .mutation(async ({ ctx }) => {
      await rbacService.seedDefaultBranchPermissions();
      await recordAudit({
        domain: "rbac",
        aggregateType: "BranchRolePermission",
        aggregateId: "system",
        action: "SEED_DEFAULTS",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        ipAddress: ctx.ip,
      });
      return { success: true };
    }),
});
