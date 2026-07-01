/**
 * OCMBR Wave 4 — D10-S05 IU-API
 * Imaging Request Module tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/imaging-request.service";

export const imagingRequestRouter = createTRPCRouter({
  listByPet: protectedProcedure
    .use(requirePermission("imaging:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listImagingRequestsByPet(input.petId)),

  listByBranch: protectedProcedure
    .use(requirePermission("imaging:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listImagingRequestsByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("imaging:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getImagingRequestById(input.id)),

  create: protectedProcedure
    .use(requirePermission("imaging:write"))
    .input(
      z.object({
        requestNumber: z.string().min(1),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        imagingType: z.enum([
          "XRAY",
          "ULTRASOUND",
          "CT",
          "MRI",
          "ENDOSCOPY",
          "OTHER",
        ]),
        bodyRegion: z.string().optional(),
        urgency: z.enum(["ROUTINE", "URGENT", "STAT"]).default("ROUTINE"),
        clinicalIndication: z.string().optional(),
        requestedById: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createImagingRequest(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("imaging:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.updateImagingRequestStatus(input.id, input.status),
    ),

  complete: protectedProcedure
    .use(requirePermission("imaging:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        reportSummary: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.completeImagingRequest(input.id, input.reportSummary),
    ),
});
