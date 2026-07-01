/**
 * OCMBR Wave 2 — D02-S04 IU-API (Router)
 * Leave Management tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/leave.service";

export const leaveRouter = createTRPCRouter({
  // ── Leave Types ─────────────────────────────────────────────────────────────

  listLeaveTypes: protectedProcedure
    .use(requirePermission("leave:read"))
    .input(z.object({ activeOnly: z.boolean().default(true) }).optional())
    .query(({ input }) => svc.listLeaveTypes(input?.activeOnly ?? true)),

  createLeaveType: protectedProcedure
    .use(requirePermission("leave:write"))
    .input(
      z.object({
        code: z.string().min(2).max(20).toUpperCase(),
        name: z.string().min(1).max(100),
        maxDaysPerYear: z
          .number()
          .nonnegative()
          .default(21)
          .transform((v) => String(v)),
        carryOverDays: z.number().int().min(0).default(0),
        isPaid: z.boolean().default(true),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(({ input }) => svc.createLeaveType(input)),

  // ── Leave Requests ──────────────────────────────────────────────────────────

  listRequests: protectedProcedure
    .use(requirePermission("leave:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        employeeId: z.number().int().positive().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listLeaveRequests(input.branchId, {
        employeeId: input.employeeId,
        status: input.status,
      }),
    ),

  getRequest: protectedProcedure
    .use(requirePermission("leave:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getLeaveRequestById(input.id)),

  createRequest: protectedProcedure
    .use(requirePermission("leave:write"))
    .input(
      z.object({
        employeeId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        leaveTypeId: z.number().int().positive(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        totalDays: z
          .number()
          .positive()
          .transform((v) => String(v)),
        reason: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.createLeaveRequest(input)),

  reviewRequest: protectedProcedure
    .use(requirePermission("leave:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["APPROVED", "REJECTED"]),
      }),
    )
    .mutation(({ input, ctx }) =>
      svc.reviewLeaveRequest(input.id, input.status, ctx.user.id),
    ),

  cancelRequest: protectedProcedure
    .use(requirePermission("leave:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelLeaveRequest(input.id)),
});
