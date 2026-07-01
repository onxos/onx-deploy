/**
 * OCMBR Wave 8 — D13-S05 IU-API
 * Workforce Analytics tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/workforce-analytics.service";

export const workforceAnalyticsRouter = createTRPCRouter({
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
        branchId: z.number().int().positive().optional(),
        snapshotMonth: z.string().regex(/^\d{4}-\d{2}$/),
        headcount: z.number().int().min(0),
        fullTimeEquivalent: z
          .number()
          .min(0)
          .transform((v) => String(v)),
        attritionRate: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        absenteeismRate: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        vacancyCount: z.number().int().min(0).default(0),
        overtimeHours: z
          .number()
          .min(0)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertSnapshot(input)),
});
