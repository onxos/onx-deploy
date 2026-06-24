import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { retrospective, improvementBacklog, patternDetection, recommendation } from "@/server/db/schema";

export const evolutionRouter = createTRPCRouter({
  retrospectiveList: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(retrospective.status, input.status));
      return db.select().from(retrospective).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(retrospective.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  retrospectiveById: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(retrospective).where(eq(retrospective.id, input.id));
      return result[0] ?? null;
    }),

  retrospectiveCreate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({
      title: z.string().min(1).max(256),
      finding: z.string().min(1),
      action: z.string().min(1),
      goalReference: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "critical"]).optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(retrospective).values(input).returning();
      return result[0];
    }),

  retrospectiveUpdate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number(), status: z.enum(["open", "in_progress", "resolved", "closed"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(retrospective).set({ status: input.status }).where(eq(retrospective.id, input.id)).returning();
      return result[0];
    }),

  retrospectiveDelete: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(retrospective).where(eq(retrospective.id, input.id));
      return { success: true };
    }),

  retrospectiveCount: protectedProcedure
    .use(requirePermission("gap:update"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(retrospective);
      return result[0]?.count ?? 0;
    }),

  improvementBacklogList: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ status: z.enum(["backlog", "in_progress", "review", "done"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(improvementBacklog.status, input.status));
      return db.select().from(improvementBacklog).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(improvementBacklog.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  improvementBacklogById: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(improvementBacklog).where(eq(improvementBacklog.id, input.id));
      return result[0] ?? null;
    }),

  improvementBacklogCreate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({
      title: z.string().min(1).max(256),
      description: z.string().optional(),
      evidence: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      effort: z.string().optional(),
      targetGate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(improvementBacklog).values(input).returning();
      return result[0];
    }),

  improvementBacklogUpdate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number(), status: z.enum(["backlog", "in_progress", "review", "done"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(improvementBacklog).set({ status: input.status }).where(eq(improvementBacklog.id, input.id)).returning();
      return result[0];
    }),

  improvementBacklogDelete: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(improvementBacklog).where(eq(improvementBacklog.id, input.id));
      return { success: true };
    }),

  improvementBacklogCount: protectedProcedure
    .use(requirePermission("gap:update"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(improvementBacklog);
      return result[0]?.count ?? 0;
    }),

  patternDetectionList: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(patternDetection).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(patternDetection.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  patternDetectionById: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(patternDetection).where(eq(patternDetection.id, input.id));
      return result[0] ?? null;
    }),

  patternDetectionCreate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({
      pattern: z.string().min(1).max(256),
      type: z.string().min(1).max(50),
      source: z.string().optional(),
      recommendation: z.string().optional(),
      confidence: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(patternDetection).values(input).returning();
      return result[0];
    }),

  patternDetectionDelete: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(patternDetection).where(eq(patternDetection.id, input.id));
      return { success: true };
    }),

  patternDetectionCount: protectedProcedure
    .use(requirePermission("gap:update"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(patternDetection);
      return result[0]?.count ?? 0;
    }),

  recommendationList: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ status: z.enum(["proposed", "under_review", "approved", "rejected", "deferred"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(recommendation.status, input.status));
      return db.select().from(recommendation).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(recommendation.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  recommendationById: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(recommendation).where(eq(recommendation.id, input.id));
      return result[0] ?? null;
    }),

  recommendationCreate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({
      title: z.string().min(1).max(256),
      description: z.string().min(1),
      cycle: z.string().optional(),
      reviewNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(recommendation).values(input).returning();
      return result[0];
    }),

  recommendationUpdate: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number(), status: z.enum(["proposed", "under_review", "approved", "rejected", "deferred"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(recommendation).set({ status: input.status }).where(eq(recommendation.id, input.id)).returning();
      return result[0];
    }),

  recommendationDelete: protectedProcedure
    .use(requirePermission("gap:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(recommendation).where(eq(recommendation.id, input.id));
      return { success: true };
    }),

  recommendationCount: protectedProcedure
    .use(requirePermission("gap:update"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(recommendation);
      return result[0]?.count ?? 0;
    }),

});