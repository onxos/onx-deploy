import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { launchChecklist, postLaunchMonitoring } from "@/server/db/schema";

export const launchRouter = createTRPCRouter({
  launchChecklistList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(launchChecklist).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(launchChecklist.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  launchChecklistById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(launchChecklist).where(eq(launchChecklist.id, input.id));
      return result[0] ?? null;
    }),

  launchChecklistCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      item: z.string().min(1).max(256),
      category: z.string().min(1).max(100),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(launchChecklist).values(input).returning();
      return result[0];
    }),

  launchChecklistDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(launchChecklist).where(eq(launchChecklist.id, input.id));
      return { success: true };
    }),

  launchChecklistCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(launchChecklist);
      return result[0]?.count ?? 0;
    }),

  postLaunchMonitoringList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(postLaunchMonitoring).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(postLaunchMonitoring.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  postLaunchMonitoringById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(postLaunchMonitoring).where(eq(postLaunchMonitoring.id, input.id));
      return result[0] ?? null;
    }),

  postLaunchMonitoringCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      metric: z.string().min(1).max(100),
      value: z.string().min(1).max(100),
      threshold: z.string().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(postLaunchMonitoring).values(input).returning();
      return result[0];
    }),

  postLaunchMonitoringDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(postLaunchMonitoring).where(eq(postLaunchMonitoring.id, input.id));
      return { success: true };
    }),

  postLaunchMonitoringCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(postLaunchMonitoring);
      return result[0]?.count ?? 0;
    }),

});