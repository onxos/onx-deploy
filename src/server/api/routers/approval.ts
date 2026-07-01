/**
 * OCMBR Wave 2 — D04-S09 IU-API (Router)
 * Procurement Approval Workflow tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/approval.service";

export const approvalRouter = createTRPCRouter({
  listWorkflows: protectedProcedure
    .use(requirePermission("approval:read"))
    .input(
      z
        .object({
          entityType: z.string().optional(),
          branchId: z.number().int().positive().optional(),
          activeOnly: z.boolean().default(true),
        })
        .optional(),
    )
    .query(({ input }) =>
      svc.listApprovalWorkflows({
        entityType: input?.entityType,
        branchId: input?.branchId,
        activeOnly: input?.activeOnly ?? true,
      }),
    ),

  getWorkflow: protectedProcedure
    .use(requirePermission("approval:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getApprovalWorkflowById(input.id)),

  createWorkflow: protectedProcedure
    .use(requirePermission("approval:write"))
    .input(
      z.object({
        name: z.string().min(1).max(100),
        entityType: z.enum(["PR", "PO", "EXPENSE", "LEAVE"]),
        approverUserId: z.string().min(1),
        sequence: z.number().int().min(1).default(1),
        minAmount: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        maxAmount: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        branchId: z.number().int().positive().optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(({ input }) => svc.createApprovalWorkflow(input)),

  updateWorkflow: protectedProcedure
    .use(requirePermission("approval:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(100).optional(),
        isActive: z.boolean().optional(),
        sequence: z.number().int().min(1).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      return svc.updateApprovalWorkflow(id, rest);
    }),

  listRecords: protectedProcedure
    .use(requirePermission("approval:read"))
    .input(
      z.object({
        entityType: z.string().min(1),
        entityId: z.number().int().positive(),
      }),
    )
    .query(({ input }) =>
      svc.listApprovalRecords(input.entityType, input.entityId),
    ),

  createRecord: protectedProcedure
    .use(requirePermission("approval:write"))
    .input(
      z.object({
        entityType: z.string().min(1).max(50),
        entityId: z.number().int().positive(),
        workflowId: z.number().int().positive().optional(),
        approverUserId: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.createApprovalRecord(input)),

  processApproval: protectedProcedure
    .use(requirePermission("approval:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["APPROVED", "REJECTED"]),
        comment: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.processApproval(input.id, input.status, input.comment),
    ),
});
