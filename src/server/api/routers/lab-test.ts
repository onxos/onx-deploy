/**
 * OCMBR Wave 3 — D10-S01 IU-API
 * Lab Test Request & Result Entry tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/lab-test.service";

export const labTestRouter = createTRPCRouter({
  listByPet: protectedProcedure
    .use(requirePermission("lab:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listLabTestsByPet(input.petId)),

  listByBranch: protectedProcedure
    .use(requirePermission("lab:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listLabTestsByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("lab:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getLabTestById(input.id)),

  create: protectedProcedure
    .use(requirePermission("lab:write"))
    .input(
      z.object({
        requestNumber: z.string().min(1),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        testCode: z.string().min(1),
        testName: z.string().min(1),
        category: z.string().optional(),
        urgency: z.enum(["ROUTINE", "URGENT", "STAT"]).default("ROUTINE"),
        sampleType: z.string().optional(),
        requestedById: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createLabTestRequest(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("lab:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.updateLabTestStatus(input.id, input.status)),

  recordResult: protectedProcedure
    .use(requirePermission("lab:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        resultSummary: z.string().min(1),
        resultData: z.unknown().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.recordLabResult(input.id, input.resultSummary, input.resultData),
    ),
});
