/**
 * OCMBR Wave 1 — D03-S01 API Layer
 * Finance Router: Chart of Accounts
 * IU-ID: D03-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/finance.service";

export const financeRouter = createTRPCRouter({
  listAccounts: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(
      z.object({
        accountType: z.string().optional(),
        branchId: z.number().int().positive().optional(),
        activeOnly: z.boolean().default(true),
        search: z.string().optional(),
      }),
    )
    .query(({ input }) => svc.listAccounts(input)),

  getAccount: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getAccountById(input.id)),

  createAccount: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        code: z.string().min(1).max(30),
        name: z.string().min(1).max(200),
        accountType: z.enum([
          "ASSET",
          "LIABILITY",
          "EQUITY",
          "REVENUE",
          "EXPENSE",
        ]),
        level: z.number().int().nonnegative().default(1),
        parentId: z.number().int().positive().optional(),
        branchId: z.number().int().positive().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createAccount(input)),

  updateAccount: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().nullable().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateAccount(id, rest)),

  deactivateAccount: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deactivateAccount(input.id)),

  seedDefaultCoA: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .mutation(({ input }) => svc.seedDefaultCoA(input.branchId)),
});
