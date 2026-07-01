/**
 * OCMBR Wave 12 — D13-S06 IU-API
 * Integration Contract Stubs tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/integration-contract.service";

export const integrationContractRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ sourceDomain: z.string().optional() }))
    .query(({ input }) => svc.listContracts(input.sourceDomain)),

  create: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        contractKey: z.string().min(1).max(100),
        sourceDomain: z.string().min(1).max(50),
        targetSystem: z.string().min(1).max(100),
        contractVersion: z.string().max(20).default("1.0"),
        inputSchema: z.record(z.string(), z.unknown()),
        outputSchema: z.record(z.string(), z.unknown()),
        description: z.string().optional(),
        activationCondition: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createContract({ ...input, status: "STUB" })),

  activate: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.activateContract(input.id)),

  listByTarget: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ targetSystem: z.string().min(1) }))
    .query(({ input }) => svc.listByTarget(input.targetSystem)),
});
