/**
 * OCMBR Wave 3 — D10-S03 IU-API
 * External Lab Referral & Import tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/external-lab.service";

export const externalLabRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("external-lab:read"))
    .query(() => svc.listExternalLabs()),

  getById: protectedProcedure
    .use(requirePermission("external-lab:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getExternalLabById(input.id)),

  create: protectedProcedure
    .use(requirePermission("external-lab:write"))
    .input(
      z.object({
        labCode: z.string().min(1),
        labName: z.string().min(1),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        address: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
        turnaroundDays: z.number().int().positive().optional(),
        specialties: z.string().optional(),
        accountNumber: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createExternalLab(input)),

  listSubmissions: protectedProcedure
    .use(requirePermission("external-lab:read"))
    .input(z.object({ labTestRequestId: z.number().int().positive() }))
    .query(({ input }) => svc.listSubmissionsByRequest(input.labTestRequestId)),

  createSubmission: protectedProcedure
    .use(requirePermission("external-lab:write"))
    .input(
      z.object({
        labTestRequestId: z.number().int().positive(),
        externalLabId: z.number().int().positive(),
        externalReference: z.string().optional(),
        expectedByDate: z.string().length(10).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createSubmission(input)),

  markReceived: protectedProcedure
    .use(requirePermission("external-lab:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.markSubmissionReceived(input.id)),
});
