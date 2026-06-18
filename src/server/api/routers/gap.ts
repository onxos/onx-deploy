import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { gapClosureItem } from "@/server/db/schema/civilization";

export const gapRouter = createTRPCRouter({
  listGaps: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          status: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.category)
        conditions.push(eq(gapClosureItem.category, input.category));
      if (input?.status)
        conditions.push(eq(gapClosureItem.status, input.status));
      return db.query.gapClosureItem.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [asc(gapClosureItem.sbpId)],
      });
    }),

  getGapSummary: publicProcedure.query(async () => {
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(gapClosureItem);
    const byCategory = await db
      .select({
        category: gapClosureItem.category,
        count: sql<number>`count(*)`,
      })
      .from(gapClosureItem)
      .groupBy(gapClosureItem.category);
    const byStatus = await db
      .select({
        status: gapClosureItem.status,
        count: sql<number>`count(*)`,
      })
      .from(gapClosureItem)
      .groupBy(gapClosureItem.status);
    return {
      total: total[0]?.count ?? 0,
      byCategory,
      byStatus,
    };
  }),

  updateGap: protectedProcedure
    .input(
      z.object({
        sbpId: z.string(),
        status: z.enum(["deferred", "partial", "in_progress", "closed"]),
        reason: z.string().optional(),
        targetGate: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { sbpId, ...data } = input;
      await db
        .update(gapClosureItem)
        .set(data)
        .where(eq(gapClosureItem.sbpId, sbpId));
      return { success: true };
    }),
});
