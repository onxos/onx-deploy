/**
 * OCMBR Wave 2e — D08-S09 IU-API
 * Shift Management & Till Close tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/shift-management.service";

export const shiftManagementRouter = createTRPCRouter({
  listTillCloses: protectedProcedure
    .use(requirePermission("shift-mgmt:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listTillCloses(input.branchId)),

  getTillClose: protectedProcedure
    .use(requirePermission("shift-mgmt:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getTillCloseById(input.id)),

  createTillClose: protectedProcedure
    .use(requirePermission("shift-mgmt:write"))
    .input(
      z.object({
        shiftId: z.number().int().positive(),
        terminalId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        closedAt: z.string().min(1),
        closedBy: z.string().min(1),
        totalSales: z
          .number()
          .nonnegative()
          .transform((v) => String(v))
          .optional(),
        totalRefunds: z
          .number()
          .nonnegative()
          .transform((v) => String(v))
          .optional(),
        netSales: z
          .number()
          .nonnegative()
          .transform((v) => String(v))
          .optional(),
        transactionCount: z.number().int().nonnegative().optional(),
        supervisorNotes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createTillClose({
        ...input,
        closedAt: new Date(input.closedAt),
      }),
    ),

  reviewTillClose: protectedProcedure
    .use(requirePermission("shift-mgmt:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        notes: z.string().optional().default(""),
      }),
    )
    .mutation(({ input }) => svc.reviewTillClose(input.id, input.notes)),

  getShiftEvents: protectedProcedure
    .use(requirePermission("shift-mgmt:read"))
    .input(z.object({ shiftId: z.number().int().positive() }))
    .query(({ input }) => svc.getShiftEvents(input.shiftId)),

  logShiftEvent: protectedProcedure
    .use(requirePermission("shift-mgmt:write"))
    .input(
      z.object({
        shiftId: z.number().int().positive(),
        eventType: z.string().min(1),
        recordedBy: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.logShiftEvent(input)),
});
