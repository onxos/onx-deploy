/**
 * OCMBR Wave 6 — D11-S07 IU-API
 * On-call Staff Management tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/oncall-schedule.service";

export const oncallScheduleRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("oncall:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listSchedulesByBranch(input.branchId)),

  listByStaff: protectedProcedure
    .use(requirePermission("oncall:read"))
    .input(z.object({ staffId: z.string().min(1) }))
    .query(({ input }) => svc.listSchedulesByStaff(input.staffId)),

  create: protectedProcedure
    .use(requirePermission("oncall:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        staffId: z.string().min(1),
        scheduleDate: z.string().min(1),
        startHour: z.number().int().min(0).max(23),
        endHour: z.number().int().min(0).max(24),
        role: z.string().min(1),
        isPrimary: z.boolean().default(true),
        contactPhone: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createSchedule(input)),

  recordCallout: protectedProcedure
    .use(requirePermission("oncall:write"))
    .input(
      z.object({
        scheduleId: z.number().int().positive().optional(),
        staffId: z.string().min(1),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.recordCallout(input)),

  updateCalloutOutcome: protectedProcedure
    .use(requirePermission("oncall:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        outcome: z.enum(["RESPONDED", "UNAVAILABLE", "ESCALATED"]),
      }),
    )
    .mutation(({ input }) => svc.updateCalloutOutcome(input.id, input.outcome)),

  listCalloutsByStaff: protectedProcedure
    .use(requirePermission("oncall:read"))
    .input(z.object({ staffId: z.string().min(1) }))
    .query(({ input }) => svc.listCalloutsByStaff(input.staffId)),
});
