/**
 * OCMBR Wave 8 — D13-S03 IU-API
 * Succession Planning tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/succession.service";

export const successionRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("appraisal:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listPlansByBranch(input.branchId)),

  create: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        branchId: z.number().int().positive().optional(),
        roleName: z.string().min(1),
        currentHolderId: z.string().optional(),
        readinessLevel: z
          .enum(["READY_NOW", "READY_1_YEAR", "READY_2_YEARS", "NOT_READY"])
          .default("NOT_READY"),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createPlan(input)),

  listCandidates: protectedProcedure
    .use(requirePermission("appraisal:read"))
    .input(z.object({ planId: z.number().int().positive() }))
    .query(({ input }) => svc.listCandidatesByPlan(input.planId)),

  addCandidate: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        planId: z.number().int().positive(),
        candidateId: z.string().min(1),
        readiness: z
          .enum(["READY_NOW", "READY_1_YEAR", "READY_2_YEARS", "NOT_READY"])
          .default("NOT_READY"),
        developmentActions: z.string().optional(),
        priority: z.number().int().min(1).default(1),
      }),
    )
    .mutation(({ input }) => svc.addCandidate(input)),

  updateReadiness: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        readiness: z.enum([
          "READY_NOW",
          "READY_1_YEAR",
          "READY_2_YEARS",
          "NOT_READY",
        ]),
      }),
    )
    .mutation(({ input }) =>
      svc.updateCandidateReadiness(input.id, input.readiness),
    ),
});
