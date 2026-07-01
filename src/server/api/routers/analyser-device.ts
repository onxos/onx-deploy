/**
 * OCMBR Wave 3 — D10-S02 IU-API
 * In-house Analyser Integration Hooks tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/analyser-device.service";

export const analyserDeviceRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("analyser:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listAnalyserDevices(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("analyser:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getAnalyserDeviceById(input.id)),

  create: protectedProcedure
    .use(requirePermission("analyser:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        deviceCode: z.string().min(1),
        deviceName: z.string().min(1),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        category: z.string().optional(),
        status: z
          .enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "DECOMMISSIONED"])
          .default("ACTIVE"),
        lastCalibrated: z.string().length(10).optional(),
        nextCalibrationDue: z.string().length(10).optional(),
        calibrationIntervalDays: z.number().int().positive().optional(),
        integrationEndpoint: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createAnalyserDevice(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("analyser:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.updateAnalyserDeviceStatus(input.id, input.status),
    ),

  recordCalibration: protectedProcedure
    .use(requirePermission("analyser:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        calibratedDate: z.string().length(10),
      }),
    )
    .mutation(({ input }) =>
      svc.recordCalibration(input.id, input.calibratedDate),
    ),
});
