/**
 * OCMBR Foundation P0 — FOUND-IU-02 API Layer
 * Tenant Router: Tenant management tRPC procedures
 *
 * Authorization:
 * - tenant:read: admin/founder (org-read for tenant listing)
 * - tenant:write: founder only (platform-level resource)
 * - invite management: tenant:write
 *
 * OCMBR Reference: FOUND-IU-02 (D15-S01, D15-S03) — API layer
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { recordAudit } from "@/server/services/audit.service";
import { publishEvent } from "@/server/services/event-outbox.service";
import * as tenantService from "@/server/services/tenant.service";

// ── Input schemas ─────────────────────────────────────────────────────────────

const createTenantInput = z.object({
  name: z.string().min(1).max(150),
  code: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Code must be lowercase alphanumeric"),
  domain: z.string().max(255).optional(),
  planTier: z
    .enum(["free", "starter", "professional", "enterprise"])
    .default("starter"),
  maxBranches: z.number().int().min(1).max(500).default(5),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(30).optional(),
  country: z.string().length(2).default("SA"),
});

const updateTenantInput = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(150).optional(),
  domain: z.string().max(255).nullable().optional(),
  planTier: z
    .enum(["free", "starter", "professional", "enterprise"])
    .optional(),
  maxBranches: z.number().int().min(1).max(500).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  isActive: z.boolean().optional(),
});

const createInviteInput = z.object({
  tenantId: z.number().int().positive(),
  email: z.string().email(),
  role: z.string().min(1).max(50),
});

// ── Router ────────────────────────────────────────────────────────────────────

export const tenantRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("tenant:read"))
    .query(() => tenantService.listTenants()),

  get: protectedProcedure
    .use(requirePermission("tenant:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => tenantService.getTenantById(input.id)),

  create: protectedProcedure
    .use(requirePermission("tenant:write"))
    .input(createTenantInput)
    .mutation(async ({ input, ctx }) => {
      const tenant = await tenantService.createTenant(input);
      await recordAudit({
        domain: "tenant",
        aggregateType: "Tenant",
        aggregateId: tenant.id,
        action: "CREATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: tenant as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "tenant",
        "Tenant",
        tenant.id,
        "tenant.created",
        tenant as Record<string, unknown>,
      );
      return tenant;
    }),

  update: protectedProcedure
    .use(requirePermission("tenant:write"))
    .input(updateTenantInput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      const old = await tenantService.getTenantById(id);
      const updated = await tenantService.updateTenant(id, rest);
      await recordAudit({
        domain: "tenant",
        aggregateType: "Tenant",
        aggregateId: id,
        action: "UPDATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        oldValue: old as Record<string, unknown>,
        newValue: updated as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "tenant",
        "Tenant",
        id,
        "tenant.updated",
        updated as Record<string, unknown>,
      );
      return updated;
    }),

  assignBrand: protectedProcedure
    .use(requirePermission("tenant:write"))
    .input(
      z.object({
        tenantId: z.number().int().positive(),
        brandId: z.number().int().positive(),
        isPrimary: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await tenantService.assignBrandToTenant(input);
      await recordAudit({
        domain: "tenant",
        aggregateType: "TenantBrand",
        aggregateId: input.tenantId,
        action: "ASSIGN_BRAND",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: result as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      return result;
    }),

  getBrands: protectedProcedure
    .use(requirePermission("tenant:read"))
    .input(z.object({ tenantId: z.number().int().positive() }))
    .query(({ input }) => tenantService.getTenantBrands(input.tenantId)),

  createInvite: protectedProcedure
    .use(requirePermission("tenant:write"))
    .input(createInviteInput)
    .mutation(async ({ input, ctx }) => {
      const invite = await tenantService.createInvite(input);
      await recordAudit({
        domain: "tenant",
        aggregateType: "TenantInvite",
        aggregateId: invite.id,
        action: "CREATE_INVITE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: {
          email: invite.email,
          role: invite.role,
          tenantId: invite.tenantId,
        },
        ipAddress: ctx.ip,
      });
      return {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      };
    }),

  validateInvite: protectedProcedure
    .use(requirePermission("tenant:read"))
    .input(z.object({ token: z.string().min(1) }))
    .query(({ input }) => tenantService.validateInviteToken(input.token)),

  acceptInvite: protectedProcedure
    .use(requirePermission("tenant:read"))
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input }) => tenantService.acceptInvite(input.token)),
});
