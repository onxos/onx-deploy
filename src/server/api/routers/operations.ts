import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { operationalMetric, systemHealth } from "@/server/db/schema";

export const operationsRouter = createTRPCRouter({
  operationalMetricList: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(operationalMetric).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(operationalMetric.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  operationalMetricById: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(operationalMetric).where(eq(operationalMetric.id, input.id));
      return result[0] ?? null;
    }),

  operationalMetricCreate: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({
      name: z.string().min(1).max(100),
      value: z.string().min(1).max(100),
      unit: z.string().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(operationalMetric).values(input).returning();
      return result[0];
    }),

  operationalMetricDelete: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(operationalMetric).where(eq(operationalMetric.id, input.id));
      return { success: true };
    }),

  operationalMetricCount: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(operationalMetric);
      return result[0]?.count ?? 0;
    }),

  systemHealthList: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ status: z.enum(["healthy", "degraded", "unhealthy", "unknown"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(systemHealth.status, input.status));
      return db.select().from(systemHealth).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(systemHealth.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  systemHealthById: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(systemHealth).where(eq(systemHealth.id, input.id));
      return result[0] ?? null;
    }),

  systemHealthCreate: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({
      component: z.string().min(1).max(100),
      status: z.enum(["healthy", "degraded", "unhealthy", "unknown"]),
      latency: z.number().optional(),
      errorRate: z.number().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(systemHealth).values(input).returning();
      return result[0];
    }),

  systemHealthUpdate: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number(), status: z.enum(["healthy", "degraded", "unhealthy", "unknown"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(systemHealth).set({ status: input.status }).where(eq(systemHealth.id, input.id)).returning();
      return result[0];
    }),

  systemHealthDelete: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(systemHealth).where(eq(systemHealth.id, input.id));
      return { success: true };
    }),

  systemHealthCount: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(systemHealth);
      return result[0]?.count ?? 0;
    }),

});