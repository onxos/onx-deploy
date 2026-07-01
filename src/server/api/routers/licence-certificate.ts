/**
 * OCMBR Wave 5 — D12-S02 IU-API
 * Licence & Certificate Tracker tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/licence-certificate.service";

export const licenceCertificateRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("compliance:read"))
    .query(() => svc.listLicences()),

  listByStaff: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ staffId: z.string().min(1) }))
    .query(({ input }) => svc.listLicencesByStaff(input.staffId)),

  getById: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getLicenceById(input.id)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        certificateCode: z.string().min(1),
        title: z.string().min(1),
        holderType: z.enum(["STAFF", "BRANCH", "ORGANISATION"]),
        holderId: z.string().min(1),
        staffId: z.string().optional(),
        branchId: z.number().int().positive().optional(),
        issuingAuthority: z.string().optional(),
        issueDate: z.string().length(10).optional(),
        expiryDate: z.string().length(10).optional(),
        status: z
          .enum([
            "ACTIVE",
            "EXPIRED",
            "SUSPENDED",
            "REVOKED",
            "PENDING_RENEWAL",
          ])
          .default("ACTIVE"),
        reminderDaysBefore: z.number().int().positive().optional(),
        documentUrl: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createLicence(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.updateLicenceStatus(input.id, input.status)),
});
