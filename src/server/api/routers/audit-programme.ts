/**
 * OCMBR Wave 6 — D12-S03 IU-API
 * Internal Audit Programme tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/audit-programme.service";

export const auditProgrammeRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ branchId: z.number().int().positive().optional() }))
    .query(({ input }) => svc.listProgrammes(input.branchId)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        branchId: z.number().int().positive().optional(),
        programmeName: z.string().min(1),
        auditArea: z.string().min(1),
        frequency: z
          .enum(["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "AD_HOC"])
          .default("ANNUAL"),
        ownerId: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createProgramme(input)),

  listInstances: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ programmeId: z.number().int().positive() }))
    .query(({ input }) => svc.listInstancesByProgramme(input.programmeId)),

  createInstance: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        programmeId: z.number().int().positive(),
        plannedDate: z.string().min(1),
        auditorId: z.string().optional(),
        summary: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createInstance(input)),

  updateInstanceStatus: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
      }),
    )
    .mutation(({ input }) => svc.updateInstanceStatus(input.id, input.status)),
});
