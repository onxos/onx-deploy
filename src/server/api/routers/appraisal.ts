/**
 * OCMBR Wave 8 — D13-S02 IU-API
 * Performance Appraisal Cycle tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/appraisal.service";

export const appraisalRouter = createTRPCRouter({
  listCycles: protectedProcedure
    .use(requirePermission("appraisal:read"))
    .input(z.object({ branchId: z.number().int().positive().optional() }))
    .query(({ input }) => svc.listCycles(input.branchId)),

  createCycle: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        branchId: z.number().int().positive().optional(),
        cycleName: z.string().min(1),
        periodStart: z.string().min(1),
        periodEnd: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.createCycle(input)),

  listRecords: protectedProcedure
    .use(requirePermission("appraisal:read"))
    .input(z.object({ cycleId: z.number().int().positive() }))
    .query(({ input }) => svc.listRecordsByCycle(input.cycleId)),

  createRecord: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        cycleId: z.number().int().positive(),
        staffId: z.string().min(1),
        reviewerId: z.string().optional(),
        selfAssessment: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createRecord(input)),

  complete: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        overallRating: z.number().int().min(1).max(5),
        reviewerComments: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.completeAppraisal(
        input.id,
        input.overallRating,
        input.reviewerComments,
      ),
    ),
});
