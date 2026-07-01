/**
 * OCMBR Wave 1 — D03-S02 API Layer
 * GL Router: Fiscal Period + Journal Entry
 * IU-ID: D03-S02-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/gl.service";

const entryLineSchema = z.object({
  accountId: z.number().int().positive(),
  debit: z
    .number()
    .nonnegative()
    .default(0)
    .transform((v) => String(v)),
  credit: z
    .number()
    .nonnegative()
    .default(0)
    .transform((v) => String(v)),
  description: z.string().optional(),
  costCenter: z.string().max(50).optional(),
});

export const glRouter = createTRPCRouter({
  // ── Periods ────────────────────────────────────────────────────────────────
  listPeriods: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(z.object({ branchId: z.number().int().positive().optional() }))
    .query(({ input }) => svc.listPeriods(input.branchId)),

  createPeriod: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        name: z.string().min(1).max(100),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        branchId: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) => svc.createPeriod(input)),

  closePeriod: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.closePeriod(input.id)),

  // ── Entries ────────────────────────────────────────────────────────────────
  listEntries: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        status: z.string().optional(),
        limit: z.number().int().max(500).default(50),
      }),
    )
    .query(({ input }) => svc.listEntries(input.branchId, input)),

  getEntry: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getEntryById(input.id)),

  getEntryLines: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(z.object({ entryId: z.number().int().positive() }))
    .query(({ input }) => svc.getEntryLines(input.entryId)),

  createEntry: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        entryType: z
          .enum([
            "JOURNAL",
            "INVOICE",
            "PAYMENT",
            "CREDIT_NOTE",
            "DEBIT_NOTE",
            "ADJUSTMENT",
          ])
          .default("JOURNAL"),
        periodId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        description: z.string().default(""),
        referenceNumber: z.string().max(80).optional(),
        createdBy: z.string(),
        lines: z.array(entryLineSchema).min(2),
      }),
    )
    .mutation(({ input: { lines, ...entry } }) =>
      svc.createEntry(entry, lines),
    ),

  postEntry: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.postEntry(input.id)),
});
