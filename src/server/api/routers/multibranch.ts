/**
 * OCMBR Wave 12 — D15-S06/07/08 IU-API
 * Multi-branch: Inter-branch Transfer, Config Override, Multi-currency
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/multibranch.service";

export const multibranchRouter = createTRPCRouter({
  // D15-S06 Inter-branch Transfer
  listTransfers: protectedProcedure
    .use(requirePermission("org:read"))
    .input(
      z.object({
        fromBranchId: z.string().optional(),
        toBranchId: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listTransfers(input.fromBranchId, input.toBranchId),
    ),

  createTransfer: protectedProcedure
    .use(requirePermission("org:write"))
    .input(
      z.object({
        fromBranchId: z.string().min(1).max(100),
        toBranchId: z.string().min(1).max(100),
        transferType: z
          .enum(["STOCK", "STAFF", "EQUIPMENT", "CASH"])
          .default("STOCK"),
        referenceNo: z.string().min(1).max(50),
        items: z.array(z.record(z.string(), z.unknown())),
        requestedBy: z.string().min(1).max(255),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createTransfer({ ...input, status: "PENDING" }),
    ),

  approveTransfer: protectedProcedure
    .use(requirePermission("org:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        approvedBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.approveTransfer(input.id, input.approvedBy)),

  completeTransfer: protectedProcedure
    .use(requirePermission("org:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completeTransfer(input.id)),

  // D15-S07 Branch Config Override
  listBranchConfigs: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ branchId: z.string().min(1) }))
    .query(({ input }) => svc.listBranchConfigs(input.branchId)),

  upsertBranchConfig: protectedProcedure
    .use(requirePermission("org:write"))
    .input(
      z.object({
        branchId: z.string().min(1).max(100),
        configKey: z.string().min(1).max(100),
        configValue: z.string().min(1),
        isOverride: z.boolean().default(true),
        effectiveFrom: z.string().datetime().optional(),
        effectiveTo: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.upsertBranchConfig({
        ...input,
        effectiveFrom: input.effectiveFrom
          ? new Date(input.effectiveFrom)
          : new Date(),
        effectiveTo: input.effectiveTo
          ? new Date(input.effectiveTo)
          : undefined,
      }),
    ),

  deleteBranchConfig: protectedProcedure
    .use(requirePermission("org:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deleteBranchConfig(input.id)),

  // D15-S08 Currency Rates
  listCurrencyRates: protectedProcedure
    .use(requirePermission("org:read"))
    .input(z.object({ fromCurrency: z.string().optional() }))
    .query(({ input }) => svc.listActiveCurrencyRates(input.fromCurrency)),

  upsertCurrencyRate: protectedProcedure
    .use(requirePermission("org:write"))
    .input(
      z.object({
        fromCurrency: z.string().min(1).max(10),
        toCurrency: z.string().min(1).max(10),
        rate: z
          .number()
          .positive()
          .transform((v) => String(v)),
        rateDate: z.string().datetime(),
        source: z.string().max(50).default("MANUAL"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(({ input }) =>
      svc.upsertCurrencyRate({
        ...input,
        rateDate: new Date(input.rateDate),
      }),
    ),
});
