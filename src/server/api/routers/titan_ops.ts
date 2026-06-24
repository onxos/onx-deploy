import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { titanMonitoringLog, titanMaintenance } from "@/server/db/schema";

export const titan_opsRouter = createTRPCRouter({
  titanMonitoringLogList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(titanMonitoringLog).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(titanMonitoringLog.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  titanMonitoringLogById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(titanMonitoringLog).where(eq(titanMonitoringLog.id, input.id));
      return result[0] ?? null;
    }),

  titanMonitoringLogCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      titanId: z.number(),
      event: z.string().min(1).max(100),
      severity: z.string().optional(),
      message: z.string().optional(),
      metadata: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(titanMonitoringLog).values(input).returning();
      return result[0];
    }),

  titanMonitoringLogDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(titanMonitoringLog).where(eq(titanMonitoringLog.id, input.id));
      return { success: true };
    }),

  titanMonitoringLogCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(titanMonitoringLog);
      return result[0]?.count ?? 0;
    }),

  titanMaintenanceList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(titanMaintenance.status, input.status));
      return db.select().from(titanMaintenance).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(titanMaintenance.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  titanMaintenanceById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(titanMaintenance).where(eq(titanMaintenance.id, input.id));
      return result[0] ?? null;
    }),

  titanMaintenanceCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      titanId: z.number(),
      type: z.string().min(1).max(50),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(titanMaintenance).values(input).returning();
      return result[0];
    }),

  titanMaintenanceUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["pending", "in_progress", "completed", "cancelled"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(titanMaintenance).set({ status: input.status }).where(eq(titanMaintenance.id, input.id)).returning();
      return result[0];
    }),

  titanMaintenanceDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(titanMaintenance).where(eq(titanMaintenance.id, input.id));
      return { success: true };
    }),

  titanMaintenanceCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(titanMaintenance);
      return result[0]?.count ?? 0;
    }),

});