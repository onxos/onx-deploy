/**
 * OCMBR Wave 4 — D10-S06 IU-API
 * DICOM Viewer Hooks (PACS) tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/dicom-study.service";

export const dicomStudyRouter = createTRPCRouter({
  listByImagingRequest: protectedProcedure
    .use(requirePermission("imaging:read"))
    .input(z.object({ imagingRequestId: z.number().int().positive() }))
    .query(({ input }) =>
      svc.listDicomStudiesByImagingRequest(input.imagingRequestId),
    ),

  getById: protectedProcedure
    .use(requirePermission("imaging:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getDicomStudyById(input.id)),

  getByUid: protectedProcedure
    .use(requirePermission("imaging:read"))
    .input(z.object({ studyUid: z.string().min(1) }))
    .query(({ input }) => svc.getDicomStudyByUid(input.studyUid)),

  create: protectedProcedure
    .use(requirePermission("imaging:write"))
    .input(
      z.object({
        imagingRequestId: z.number().int().positive(),
        studyUid: z.string().min(1),
        studyDate: z.string().length(10).optional(),
        modality: z.string().optional(),
        description: z.string().optional(),
        pacsUrl: z.string().optional(),
        viewerUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        seriesCount: z.number().int().optional(),
        imageCount: z.number().int().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createDicomStudy(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("imaging:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.updateDicomStudyStatus(input.id, input.status),
    ),
});
