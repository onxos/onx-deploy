/**
 * OCMBR Wave 2f — D08-S04 IU-API
 * Receipt & Invoice Generation tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/pos-receipt.service";

export const posReceiptRouter = createTRPCRouter({
  listReceipts: protectedProcedure
    .use(requirePermission("receipt:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listReceipts(input.branchId)),

  getReceipt: protectedProcedure
    .use(requirePermission("receipt:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReceiptById(input.id)),

  getReceiptLines: protectedProcedure
    .use(requirePermission("receipt:read"))
    .input(z.object({ receiptId: z.number().int().positive() }))
    .query(({ input }) => svc.getReceiptLines(input.receiptId)),

  createReceipt: protectedProcedure
    .use(requirePermission("receipt:write"))
    .input(
      z.object({
        receipt: z.object({
          receiptNumber: z.string().min(1),
          terminalId: z.number().int().positive(),
          shiftId: z.number().int().positive().optional(),
          branchId: z.number().int().positive(),
          clientId: z.number().int().positive().optional(),
          cashierId: z.string().optional(),
          transactionDate: z.string().length(10),
          transactionTime: z.string().length(8).optional(),
          subtotal: z
            .number()
            .nonnegative()
            .transform((v) => String(v)),
          discountAmount: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          taxAmount: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          totalAmount: z
            .number()
            .nonnegative()
            .transform((v) => String(v)),
          paymentMethod: z.enum(["CASH", "CARD", "MOBILE", "MIXED"]).optional(),
          amountTendered: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          changeGiven: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          notes: z.string().optional(),
        }),
        lines: z
          .array(
            z.object({
              description: z.string().min(1),
              quantity: z
                .number()
                .positive()
                .transform((v) => String(v)),
              unitPrice: z
                .number()
                .nonnegative()
                .transform((v) => String(v)),
              discountAmount: z
                .number()
                .nonnegative()
                .transform((v) => String(v))
                .optional(),
              lineTotal: z
                .number()
                .nonnegative()
                .transform((v) => String(v)),
              catalogueEntryId: z.number().int().positive().optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(({ input }) => svc.createReceipt(input.receipt, input.lines)),

  voidReceipt: protectedProcedure
    .use(requirePermission("receipt:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.voidReceipt(input.id)),
});
