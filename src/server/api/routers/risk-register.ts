/**
 * OCMBR Wave 7 — D12-S05 IU-API
 * Risk Register tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/risk-register.service";

export const riskRegisterRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ branchId: z.number().int().positive().optional() }))
    .query(({ input }) => svc.listRisks(input.branchId)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        branchId: z.number().int().positive().optional(),
        riskCode: z.string().min(1).max(50),
        title: z.string().min(1),
        category: z.string().min(1),
        description: z.string().min(1),
        likelihood: z.number().int().min(1).max(5),
        impact: z.number().int().min(1).max(5),
        riskScore: z.number().int().min(1).max(25),
        ownerId: z.string().optional(),
        mitigationPlan: z.string().optional(),
        reviewDate: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createRisk(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["OPEN", "MITIGATED", "ACCEPTED", "CLOSED"]),
      }),
    )
    .mutation(({ input }) => svc.updateRiskStatus(input.id, input.status)),

  updateMitigation: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        mitigationPlan: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.updateMitigationPlan(input.id, input.mitigationPlan),
    ),
});
