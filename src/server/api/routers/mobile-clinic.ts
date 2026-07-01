/**
 * OCMBR Wave 5 — D11-S03 IU-API
 * Mobile Clinic Schedule & Route tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/mobile-clinic.service";

export const mobileClinicRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("mobile-clinic:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listRoutesByBranch(input.branchId)),

  getRouteById: protectedProcedure
    .use(requirePermission("mobile-clinic:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getRouteById(input.id)),

  listStops: protectedProcedure
    .use(requirePermission("mobile-clinic:read"))
    .input(z.object({ routeId: z.number().int().positive() }))
    .query(({ input }) => svc.listStopsByRoute(input.routeId)),

  createRoute: protectedProcedure
    .use(requirePermission("mobile-clinic:write"))
    .input(
      z.object({
        route: z.object({
          routeCode: z.string().min(1),
          branchId: z.number().int().positive(),
          driverId: z.string().optional(),
          scheduledDate: z.string().length(10),
          startTime: z.string().length(5).optional(),
          endTime: z.string().length(5).optional(),
          vehicleDetails: z.string().optional(),
          startLocation: z.string().optional(),
          endLocation: z.string().optional(),
          notes: z.string().optional(),
        }),
        stops: z
          .array(
            z.object({
              stopOrder: z.number().int().positive(),
              location: z.string().min(1),
              contactName: z.string().optional(),
              contactPhone: z.string().optional(),
              estimatedArrival: z.string().length(5).optional(),
              notes: z.string().optional(),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input }) => svc.createRoute(input.route, input.stops)),

  updateStatus: protectedProcedure
    .use(requirePermission("mobile-clinic:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.updateRouteStatus(input.id, input.status)),
});
