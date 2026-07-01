/**
 * OCMBR Foundation P0 — FOUND-IU-01 API Layer
 * Org Router: Brand + Branch tRPC procedures
 *
 * Authorization:
 * - Read: any authenticated user with org:read
 * - Write (create/update/deactivate): admin:read + org:write (admin/founder only)
 *
 * Audit: all writes recorded via audit.service
 * Events: create/update events published to event outbox
 *
 * OCMBR Reference: FOUND-IU-01 (D15-S01, D15-S02) — API layer
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { recordAudit } from "@/server/services/audit.service";
import { publishEvent } from "@/server/services/event-outbox.service";
import * as orgService from "@/server/services/org.service";

// ── Input schemas ─────────────────────────────────────────────────────────────

const createBrandInput = z.object({
  name: z.string().min(1).max(100),
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric"),
  logoUrl: z.string().url().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  website: z.string().url().optional(),
});

const updateBrandInput = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .optional(),
  website: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});

const createBranchInput = z.object({
  brandId: z.number().int().positive(),
  name: z.string().min(1).max(150),
  code: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric"),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  stateProvince: z.string().max(100).optional(),
  country: z.string().length(2).default("SA"),
  postalCode: z.string().max(20).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  timezone: z.string().max(60).default("Asia/Riyadh"),
  currency: z.string().length(3).default("SAR"),
  isHeadquarters: z.boolean().default(false),
});

const updateBranchInput = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(150).optional(),
  addressLine1: z.string().max(255).nullable().optional(),
  addressLine2: z.string().max(255).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().nullable().optional(),
  timezone: z.string().max(60).optional(),
  currency: z.string().length(3).optional(),
  isActive: z.boolean().optional(),
  isHeadquarters: z.boolean().optional(),
});

// ── Router ────────────────────────────────────────────────────────────────────

export const orgRouter = createTRPCRouter({
  // ── Brand procedures ──────────────────────────────────────────────────────

  listBrands: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ activeOnly: z.boolean().default(true) }).optional())
    .query(({ input }) => orgService.listBrands(input?.activeOnly ?? true)),

  getBrand: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => orgService.getBrandById(input.id)),

  createBrand: protectedProcedure
    .use(requirePermission("org:write"))
    .input(createBrandInput)
    .mutation(async ({ input, ctx }) => {
      const newBrand = await orgService.createBrand(input);
      await recordAudit({
        domain: "org",
        aggregateType: "Brand",
        aggregateId: newBrand.id,
        action: "CREATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: newBrand as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "org",
        "Brand",
        newBrand.id,
        "brand.created",
        newBrand as Record<string, unknown>,
      );
      return newBrand;
    }),

  updateBrand: protectedProcedure
    .use(requirePermission("org:write"))
    .input(updateBrandInput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      const old = await orgService.getBrandById(id);
      const updated = await orgService.updateBrand(id, rest);
      await recordAudit({
        domain: "org",
        aggregateType: "Brand",
        aggregateId: id,
        action: "UPDATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        oldValue: old as Record<string, unknown>,
        newValue: updated as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "org",
        "Brand",
        id,
        "brand.updated",
        updated as Record<string, unknown>,
      );
      return updated;
    }),

  deactivateBrand: protectedProcedure
    .use(requirePermission("org:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const old = await orgService.getBrandById(input.id);
      const updated = await orgService.deactivateBrand(input.id);
      await recordAudit({
        domain: "org",
        aggregateType: "Brand",
        aggregateId: input.id,
        action: "DEACTIVATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        oldValue: old as Record<string, unknown>,
        newValue: updated as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent("org", "Brand", input.id, "brand.deactivated", {
        id: input.id,
      });
      return updated;
    }),

  // ── Branch procedures ─────────────────────────────────────────────────────

  listBranches: protectedProcedure
    .use(requirePermission("org:read"))
    .input(
      z
        .object({
          brandId: z.number().int().positive().optional(),
          activeOnly: z.boolean().default(true),
        })
        .optional(),
    )
    .query(({ input }) =>
      orgService.listBranches(input?.brandId, input?.activeOnly ?? true),
    ),

  getBranch: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => orgService.getBranchById(input.id)),

  createBranch: protectedProcedure
    .use(requirePermission("org:write"))
    .input(createBranchInput)
    .mutation(async ({ input, ctx }) => {
      const newBranch = await orgService.createBranch(input);
      await recordAudit({
        domain: "org",
        aggregateType: "Branch",
        aggregateId: newBranch.id,
        action: "CREATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        newValue: newBranch as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "org",
        "Branch",
        newBranch.id,
        "branch.created",
        newBranch as Record<string, unknown>,
      );
      return newBranch;
    }),

  updateBranch: protectedProcedure
    .use(requirePermission("org:write"))
    .input(updateBranchInput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      const old = await orgService.getBranchById(id);
      const updated = await orgService.updateBranch(id, rest);
      await recordAudit({
        domain: "org",
        aggregateType: "Branch",
        aggregateId: id,
        action: "UPDATE",
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        oldValue: old as Record<string, unknown>,
        newValue: updated as Record<string, unknown>,
        ipAddress: ctx.ip,
      });
      await publishEvent(
        "org",
        "Branch",
        id,
        "branch.updated",
        updated as Record<string, unknown>,
      );
      return updated;
    }),
});
