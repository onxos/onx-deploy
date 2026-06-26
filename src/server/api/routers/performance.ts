import { and, desc, eq, type SQL, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { loadTestResult, performanceMetric } from "@/server/db/schema";

export const performanceRouter = createTRPCRouter({
  performanceMetricList: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z
        .object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      return db
        .select()
        .from(performanceMetric)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(performanceMetric.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  performanceMetricById: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(performanceMetric)
        .where(eq(performanceMetric.id, input.id));
      return result[0] ?? null;
    }),

  performanceMetricCreate: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z.object({
        name: z.string().min(1).max(100),
        value: z.number(),
        unit: z.string().optional(),
        threshold: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(performanceMetric)
        .values(input)
        .returning();
      return result[0];
    }),

  performanceMetricDelete: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(performanceMetric)
        .where(eq(performanceMetric.id, input.id));
      return { success: true };
    }),

  performanceMetricCount: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(performanceMetric);
      return result[0]?.count ?? 0;
    }),

  loadTestResultList: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z
        .object({
          status: z.enum(["running", "completed", "failed"]).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      if (input?.status)
        conditions.push(eq(loadTestResult.status, input.status));
      return db
        .select()
        .from(loadTestResult)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(loadTestResult.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  loadTestResultById: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(loadTestResult)
        .where(eq(loadTestResult.id, input.id));
      return result[0] ?? null;
    }),

  loadTestResultCreate: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z.object({
        scenario: z.string().min(1).max(256),
        concurrentUsers: z.number().optional(),
        avgResponseTime: z.number().optional(),
        p95ResponseTime: z.number().optional(),
        errorRate: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(loadTestResult).values(input).returning();
      return result[0];
    }),

  loadTestResultUpdate: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["running", "completed", "failed"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(loadTestResult)
        .set({ status: input.status })
        .where(eq(loadTestResult.id, input.id))
        .returning();
      return result[0];
    }),

  loadTestResultDelete: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(loadTestResult).where(eq(loadTestResult.id, input.id));
      return { success: true };
    }),

  loadTestResultCount: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(loadTestResult);
      return result[0]?.count ?? 0;
    }),
});
