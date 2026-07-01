/**
 * OCMBR Wave 6 — D12-S04 IU-API
 * Audit Finding & CAPA tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/audit-finding.service";

export const auditFindingRouter = createTRPCRouter({
  listByInstance: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ auditInstanceId: z.number().int().positive() }))
    .query(({ input }) => svc.listFindingsByInstance(input.auditInstanceId)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        auditInstanceId: z.number().int().positive(),
        findingCode: z.string().min(1).max(50),
        description: z.string().min(1),
        severity: z
          .enum(["CRITICAL", "MAJOR", "MINOR", "OBSERVATION"])
          .default("MINOR"),
        dueDate: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createFinding(input)),

  close: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.closeFinding(input.id)),

  listCapa: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ findingId: z.number().int().positive() }))
    .query(({ input }) => svc.listCapaByFinding(input.findingId)),

  createCapa: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        findingId: z.number().int().positive(),
        capaType: z.enum(["CORRECTIVE", "PREVENTIVE"]).default("CORRECTIVE"),
        description: z.string().min(1),
        ownerId: z.string().optional(),
        targetDate: z.string().min(1),
        verificationEvidence: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createCapa(input)),

  completeCapa: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completeCapaItem(input.id)),
});
