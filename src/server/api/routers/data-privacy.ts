/**
 * OCMBR Wave 7 — D12-S08 IU-API
 * Data Protection & Privacy Register tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/data-privacy.service";

export const dataPrivacyRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("compliance:read"))
    .query(() => svc.listActivities()),

  getById: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getActivityById(input.id)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        activityCode: z.string().min(1).max(50),
        activityName: z.string().min(1),
        purpose: z.string().min(1),
        legalBasis: z.string().min(1),
        dataCategories: z.string().min(1),
        retentionPeriod: z.string().min(1),
        thirdPartySharing: z.boolean().default(false),
        thirdPartyDetails: z.string().optional(),
        ownerId: z.string().optional(),
        riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW"),
        dpiaRequired: z.boolean().default(false),
        dpiaCompletedDate: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createActivity(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["ACTIVE", "UNDER_REVIEW", "ARCHIVED"]),
      }),
    )
    .mutation(({ input }) => svc.updateActivityStatus(input.id, input.status)),
});
