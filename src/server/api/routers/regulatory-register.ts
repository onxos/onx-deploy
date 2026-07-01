/**
 * OCMBR Wave 5 — D12-S01 IU-API
 * Regulatory Register tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/regulatory-register.service";

export const regulatoryRegisterRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("compliance:read"))
    .query(() => svc.listRegulatoryRequirements()),

  getById: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getRegulatoryRequirementById(input.id)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        requirementCode: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        regulatoryBody: z.string().optional(),
        jurisdiction: z.string().optional(),
        category: z.string().optional(),
        complianceFrequency: z.string().optional(),
        dueDate: z.string().length(10).optional(),
        status: z
          .enum([
            "ACTIVE",
            "COMPLIANT",
            "NON_COMPLIANT",
            "WAIVED",
            "SUPERSEDED",
          ])
          .default("ACTIVE"),
        riskLevel: z
          .enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"])
          .default("MEDIUM"),
        referenceUrl: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createRegulatoryRequirement(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.updateRequirementStatus(input.id, input.status),
    ),
});
