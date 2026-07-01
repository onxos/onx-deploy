/**
 * OCMBR Wave 4 — D10-S04 IU-API
 * Lab Result History & Trends tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/lab-result-history.service";

export const labResultHistoryRouter = createTRPCRouter({
  listReferenceRanges: protectedProcedure
    .use(requirePermission("lab:read"))
    .input(z.object({ testCode: z.string().optional() }))
    .query(({ input }) => svc.listReferenceRanges(input.testCode)),

  getReferenceRangeById: protectedProcedure
    .use(requirePermission("lab:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReferenceRangeById(input.id)),

  createReferenceRange: protectedProcedure
    .use(requirePermission("lab:write"))
    .input(
      z.object({
        testCode: z.string().min(1),
        testName: z.string().min(1),
        species: z
          .enum([
            "ALL",
            "CANINE",
            "FELINE",
            "EQUINE",
            "BOVINE",
            "AVIAN",
            "EXOTIC",
          ])
          .default("ALL"),
        unit: z.string().optional(),
        lowNormal: z.string().optional(),
        highNormal: z.string().optional(),
        criticalLow: z.string().optional(),
        criticalHigh: z.string().optional(),
        notes: z.string().optional(),
        isActive: z.enum(["YES", "NO"]).default("YES"),
      }),
    )
    .mutation(({ input }) => svc.createReferenceRange(input)),

  listAnnotations: protectedProcedure
    .use(requirePermission("lab:read"))
    .input(z.object({ labTestRequestId: z.number().int().positive() }))
    .query(({ input }) => svc.listAnnotationsByRequest(input.labTestRequestId)),

  createAnnotation: protectedProcedure
    .use(requirePermission("lab:write"))
    .input(
      z.object({
        labTestRequestId: z.number().int().positive(),
        annotation: z.string().min(1),
        annotatedBy: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createAnnotation(input)),
});
