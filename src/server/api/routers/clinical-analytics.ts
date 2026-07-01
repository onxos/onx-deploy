/**
 * OCMBR Wave 8 — D14-S01 IU-API
 * Clinical Analytics Dashboard tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/clinical-analytics.service";

export const clinicalAnalyticsRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listSnapshotsByBranch(input.branchId)),

  getByMonth: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        snapshotMonth: z.string().regex(/^\d{4}-\d{2}$/),
      }),
    )
    .query(({ input }) =>
      svc.getSnapshotByMonth(input.branchId, input.snapshotMonth),
    ),

  upsert: protectedProcedure
    .use(requirePermission("analytics:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        snapshotMonth: z.string().regex(/^\d{4}-\d{2}$/),
        totalConsultations: z.number().int().min(0).default(0),
        totalSurgeries: z.number().int().min(0).default(0),
        totalEmergencies: z.number().int().min(0).default(0),
        totalHospitalisations: z.number().int().min(0).default(0),
        avgConsultationMinutes: z
          .number()
          .min(0)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        readmissionRate: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        mortalityCount: z.number().int().min(0).default(0),
        outcomeSatisfactionScore: z
          .number()
          .min(0)
          .max(5)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertSnapshot(input)),
});
