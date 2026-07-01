/**
 * OCMBR Wave 13 — D01-S01/02/03, D15-S09/10 IU-API
 * Executive Governance + Multi-language + Tenant Onboarding
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/executive.service";

const numStr = z.number().transform((v) => String(v));

export const executiveRouter = createTRPCRouter({
  // D01-S01 Exec Dashboard
  listExecKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listExecKpis(input.branchId)),

  upsertExecKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        periodLabel: z.string().min(1).max(50),
        branchId: z.string().optional(),
        totalRevenue: numStr.optional(),
        totalHeadcount: numStr.optional(),
        totalPatients: numStr.optional(),
        openDecisions: numStr.optional(),
        escalationCount: numStr.optional(),
        okrProgress: numStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertExecKpi(input)),

  // D01-S02 Approval Authority Matrix
  listApprovalMatrix: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ entityType: z.string().optional() }))
    .query(({ input }) => svc.listApprovalMatrix(input.entityType)),

  createApprovalMatrix: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        entityType: z.string().min(1).max(100),
        minAmount: numStr.optional(),
        maxAmount: numStr.optional(),
        requiredRole: z.string().min(1).max(100),
        approverUserId: z.string().optional(),
        quorum: numStr.optional(),
        isActive: z.boolean().default(true),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createApprovalMatrix({ ...input, isActive: String(input.isActive) }),
    ),

  // D01-S03 Board Resolutions
  listResolutions: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ category: z.string().optional() }))
    .query(({ input }) => svc.listResolutions(input.category)),

  createResolution: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        resolutionNo: z.string().min(1).max(50),
        title: z.string().min(1).max(200),
        category: z.string().max(100).default("GENERAL"),
        summary: z.string().min(1),
        fullText: z.string().optional(),
        adoptedBy: z.string().min(1),
        adoptedAt: z.string().datetime(),
        effectiveDate: z.string().datetime().optional(),
        expiryDate: z.string().datetime().optional(),
        status: z.enum(["ACTIVE", "SUPERSEDED", "EXPIRED"]).default("ACTIVE"),
      }),
    )
    .mutation(({ input }) =>
      svc.createResolution({
        ...input,
        adoptedAt: new Date(input.adoptedAt),
        effectiveDate: input.effectiveDate
          ? new Date(input.effectiveDate)
          : undefined,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
      }),
    ),

  getResolution: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ resolutionNo: z.string().min(1) }))
    .query(({ input }) => svc.getResolution(input.resolutionNo)),

  // D15-S09 Language Config
  listLanguageConfigs: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ tenantId: z.string().optional() }))
    .query(({ input }) => svc.listLanguageConfigs(input.tenantId)),

  createLanguageConfig: protectedProcedure
    .use(requirePermission("org:write"))
    .input(
      z.object({
        tenantId: z.string().optional(),
        languageCode: z.string().min(2).max(10),
        displayName: z.string().min(1).max(100),
        isDefault: z.boolean().default(false),
        isEnabled: z.boolean().default(true),
        rtl: z.boolean().default(false),
      }),
    )
    .mutation(({ input }) =>
      svc.createLanguageConfig({
        ...input,
        isDefault: String(input.isDefault),
        isEnabled: String(input.isEnabled),
        rtl: String(input.rtl),
      }),
    ),

  // D15-S10 Tenant Onboarding
  listOnboardingSteps: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ tenantId: z.string().min(1) }))
    .query(({ input }) => svc.listOnboardingSteps(input.tenantId)),

  createOnboardingStep: protectedProcedure
    .use(requirePermission("org:write"))
    .input(
      z.object({
        tenantId: z.string().min(1),
        step: z.string().min(1).max(100),
        notes: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createOnboardingStep({ ...input, status: "PENDING" }),
    ),

  completeOnboardingStep: protectedProcedure
    .use(requirePermission("org:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completeOnboardingStep(input.id)),
});
