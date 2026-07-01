/**
 * OCMBR Wave 2 — D09-S02 IU-API (Router)
 * Appointment Scheduling tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/appointment.service";

export const appointmentRouter = createTRPCRouter({
  listAppointments: protectedProcedure
    .use(requirePermission("appointment:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        petId: z.number().int().positive().optional(),
        vetId: z.string().optional(),
        status: z.string().optional(),
        from: z.string().datetime({ offset: true }).optional(),
        to: z.string().datetime({ offset: true }).optional(),
      }),
    )
    .query(({ input }) =>
      svc.listAppointments(input.branchId, {
        petId: input.petId,
        vetId: input.vetId,
        status: input.status,
        from: input.from ? new Date(input.from) : undefined,
        to: input.to ? new Date(input.to) : undefined,
      }),
    ),

  getAppointment: protectedProcedure
    .use(requirePermission("appointment:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getAppointmentById(input.id)),

  createAppointment: protectedProcedure
    .use(requirePermission("appointment:write"))
    .input(
      z.object({
        appointmentNumber: z.string().min(1).max(50),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        assignedVetId: z.string().optional(),
        appointmentType: z
          .enum([
            "CONSULTATION",
            "VACCINATION",
            "GROOMING",
            "SURGERY",
            "FOLLOW_UP",
            "EMERGENCY",
          ])
          .default("CONSULTATION"),
        scheduledAt: z.string().datetime({ offset: true }),
        durationMinutes: z.number().int().min(5).default(30),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { scheduledAt, ...rest } = input;
      return svc.createAppointment({
        ...rest,
        scheduledAt: new Date(scheduledAt),
      });
    }),

  updateStatus: protectedProcedure
    .use(requirePermission("appointment:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum([
          "CONFIRMED",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW",
        ]),
        cancelReason: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.updateAppointmentStatus(input.id, input.status, {
        cancelReason: input.cancelReason,
      }),
    ),

  updateAppointment: protectedProcedure
    .use(requirePermission("appointment:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        assignedVetId: z.string().optional(),
        scheduledAt: z.string().datetime({ offset: true }).optional(),
        durationMinutes: z.number().int().min(5).optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, scheduledAt, ...rest } = input;
      return svc.updateAppointment(id, {
        ...rest,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      });
    }),
});
