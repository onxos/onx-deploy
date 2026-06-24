import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { releaseRecord, deploymentTracking } from "@/server/db/schema";

export const release_mgmtRouter = createTRPCRouter({
  releaseRecordList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["planning", "ready", "deployed", "rolled_back"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(releaseRecord.status, input.status));
      return db.select().from(releaseRecord).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(releaseRecord.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  releaseRecordById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(releaseRecord).where(eq(releaseRecord.id, input.id));
      return result[0] ?? null;
    }),

  releaseRecordCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      version: z.string().min(1).max(50),
      name: z.string().min(1).max(256),
      description: z.string().optional(),
      rollbackVersion: z.string().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(releaseRecord).values(input).returning();
      return result[0];
    }),

  releaseRecordUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["planning", "ready", "deployed", "rolled_back"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(releaseRecord).set({ status: input.status }).where(eq(releaseRecord.id, input.id)).returning();
      return result[0];
    }),

  releaseRecordDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(releaseRecord).where(eq(releaseRecord.id, input.id));
      return { success: true };
    }),

  releaseRecordCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(releaseRecord);
      return result[0]?.count ?? 0;
    }),

  deploymentTrackingList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["pending", "in_progress", "completed", "failed"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(deploymentTracking.status, input.status));
      return db.select().from(deploymentTracking).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(deploymentTracking.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  deploymentTrackingById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(deploymentTracking).where(eq(deploymentTracking.id, input.id));
      return result[0] ?? null;
    }),

  deploymentTrackingCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      releaseId: z.number(),
      environment: z.string().min(1).max(50),
      logs: z.string().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(deploymentTracking).values(input).returning();
      return result[0];
    }),

  deploymentTrackingUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["pending", "in_progress", "completed", "failed"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(deploymentTracking).set({ status: input.status }).where(eq(deploymentTracking.id, input.id)).returning();
      return result[0];
    }),

  deploymentTrackingDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(deploymentTracking).where(eq(deploymentTracking.id, input.id));
      return { success: true };
    }),

  deploymentTrackingCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(deploymentTracking);
      return result[0]?.count ?? 0;
    }),

});