/**
 * OCMBR Wave 7 — D12-S07 IU-API
 * Policy & Procedure Management tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/policy-document.service";

export const policyDocumentRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("compliance:read"))
    .query(() => svc.listDocuments()),

  getById: protectedProcedure
    .use(requirePermission("compliance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getDocumentById(input.id)),

  create: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        documentCode: z.string().min(1).max(50),
        title: z.string().min(1),
        category: z.enum(["POLICY", "PROCEDURE", "GUIDELINE", "SOP", "FORM"]),
        version: z.string().default("1.0"),
        ownerId: z.string().optional(),
        effectiveDate: z.string().optional(),
        reviewDate: z.string().optional(),
        content: z.string().optional(),
        fileUrl: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createDocument(input)),

  approve: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        approvedById: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.approveDocument(input.id, input.approvedById)),

  archive: protectedProcedure
    .use(requirePermission("compliance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.archiveDocument(input.id)),
});
