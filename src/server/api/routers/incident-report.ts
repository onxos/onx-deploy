/**
 * OCMBR Wave 7 — D12-S06 IU-API
 * Incident Reporting tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/incident-report.service";

export const incidentReportRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listIncidentsByBranch(input.branchId)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        reportCode: z.string().min(1).max(50),
        incidentType: z.string().min(1),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("LOW"),
        description: z.string().min(1),
        occurredAt: z.string().datetime(),
        reportedById: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.createIncident({
        ...input,
        occurredAt: new Date(input.occurredAt),
      }),
    ),

  updateStatus: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["OPEN", "UNDER_INVESTIGATION", "RESOLVED", "CLOSED"]),
      }),
    )
    .mutation(({ input }) => svc.updateIncidentStatus(input.id, input.status)),

  close: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        resolution: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.closeIncident(input.id, input.resolution)),
});
