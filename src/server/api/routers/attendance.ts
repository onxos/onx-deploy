/**
 * OCMBR Wave 2 — D02-S03 IU-API (Router)
 * Attendance & Timesheet tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/attendance.service";

export const attendanceRouter = createTRPCRouter({
  listEntries: protectedProcedure
    .use(requirePermission("attendance:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        employeeId: z.number().int().positive().optional(),
        status: z.string().optional(),
        limit: z.number().int().positive().max(500).optional(),
      }),
    )
    .query(({ input }) =>
      svc.listTimesheetEntries(input.branchId, {
        employeeId: input.employeeId,
        status: input.status,
        limit: input.limit,
      }),
    ),

  getEntry: protectedProcedure
    .use(requirePermission("attendance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getTimesheetEntryById(input.id)),

  createEntry: protectedProcedure
    .use(requirePermission("attendance:write"))
    .input(
      z.object({
        employeeId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        clockIn: z.string().datetime({ offset: true }).optional(),
        clockOut: z.string().datetime({ offset: true }).optional(),
        breakMinutes: z.number().int().min(0).default(0),
        overtimeMinutes: z.number().int().min(0).default(0),
        regularHours: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { clockIn, clockOut, ...rest } = input;
      return svc.createTimesheetEntry({
        ...rest,
        clockIn: clockIn ? new Date(clockIn) : undefined,
        clockOut: clockOut ? new Date(clockOut) : undefined,
      });
    }),

  approveEntry: protectedProcedure
    .use(requirePermission("attendance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input, ctx }) =>
      svc.approveTimesheetEntry(input.id, ctx.user.id),
    ),

  rejectEntry: protectedProcedure
    .use(requirePermission("attendance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      svc.rejectTimesheetEntry(input.id, ctx.user.id, input.notes),
    ),
});
