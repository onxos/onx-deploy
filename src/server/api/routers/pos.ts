/**
 * OCMBR Wave 1 — D08-S01 API Layer
 * POS Router: Terminal + Shift management
 * IU-ID: D08-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/pos.service";

export const posRouter = createTRPCRouter({
  // ── Terminals ──────────────────────────────────────────────────────────────
  listTerminals: protectedProcedure
    .use(requirePermission("pos:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listTerminals(input.branchId)),

  getTerminal: protectedProcedure
    .use(requirePermission("pos:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getTerminalById(input.id)),

  createTerminal: protectedProcedure
    .use(requirePermission("pos:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        terminalCode: z.string().min(1).max(30),
        terminalName: z.string().min(1).max(100),
        ipAddress: z.string().max(50).optional(),
      }),
    )
    .mutation(({ input }) => svc.createTerminal(input)),

  updateTerminal: protectedProcedure
    .use(requirePermission("pos:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        terminalName: z.string().min(1).max(100).optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).optional(),
        ipAddress: z.string().max(50).nullable().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateTerminal(id, rest)),

  // ── Shifts ─────────────────────────────────────────────────────────────────
  listShifts: protectedProcedure
    .use(requirePermission("pos:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        status: z.string().optional(),
        limit: z.number().int().max(500).default(50),
      }),
    )
    .query(({ input }) => svc.listShifts(input.branchId, input)),

  getActiveShift: protectedProcedure
    .use(requirePermission("pos:read"))
    .input(z.object({ terminalId: z.number().int().positive() }))
    .query(({ input }) => svc.getActiveShift(input.terminalId)),

  openShift: protectedProcedure
    .use(requirePermission("pos:write"))
    .input(
      z.object({
        terminalId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        cashierId: z.string(),
        openingBalance: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
      }),
    )
    .mutation(({ input }) => svc.openShift(input)),

  closeShift: protectedProcedure
    .use(requirePermission("pos:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        closingBalance: z.number().nonnegative(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.closeShift(input.id, input.closingBalance, input.notes),
    ),
});
