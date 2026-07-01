/**
 * OCMBR Wave 2e — D07-S02 IU-API
 * Pet Profile & Medical Summary tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/pet-profile.service";

export const petProfileRouter = createTRPCRouter({
  listAlerts: protectedProcedure
    .use(requirePermission("pet-profile:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listAlerts(input.petId)),

  createAlert: protectedProcedure
    .use(requirePermission("pet-profile:write"))
    .input(
      z.object({
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        alertType: z.string().min(1),
        description: z.string().min(1),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
        recordedBy: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createAlert(input)),

  resolveAlert: protectedProcedure
    .use(requirePermission("pet-profile:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.resolveAlert(input.id)),

  listWeightRecords: protectedProcedure
    .use(requirePermission("pet-profile:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listWeightRecords(input.petId)),

  recordWeight: protectedProcedure
    .use(requirePermission("pet-profile:write"))
    .input(
      z.object({
        petId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        recordDate: z.string().length(10),
        weightKg: z.string().min(1),
        recordedBy: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.recordWeight(input)),

  listDocuments: protectedProcedure
    .use(requirePermission("pet-profile:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listDocuments(input.petId)),

  addDocument: protectedProcedure
    .use(requirePermission("pet-profile:write"))
    .input(
      z.object({
        petId: z.number().int().positive(),
        documentType: z.string().min(1),
        title: z.string().min(1),
        fileUrl: z.string().min(1),
        uploadedBy: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.addDocument(input)),
});
