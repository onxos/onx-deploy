import { and, desc, eq, type SQL, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  contentReview,
  editorialPolicy,
  publicationSchedule,
} from "@/server/db/schema";

export const editorialRouter = createTRPCRouter({
  editorialPolicyList: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z
        .object({
          status: z
            .enum(["draft", "under_review", "published", "archived"])
            .optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      if (input?.status)
        conditions.push(eq(editorialPolicy.status, input.status));
      return db
        .select()
        .from(editorialPolicy)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(editorialPolicy.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  editorialPolicyById: protectedProcedure
    .use(requirePermission("article:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(editorialPolicy)
        .where(eq(editorialPolicy.id, input.id));
      return result[0] ?? null;
    }),

  editorialPolicyCreate: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z.object({
        name: z.string().min(1).max(256),
        scope: z.string().min(1).max(100),
        content: z.string().min(1),
        version: z.string().optional(),
      }),
    )
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(editorialPolicy).values(input).returning();
      return result[0];
    }),

  editorialPolicyUpdate: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "under_review", "published", "archived"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(editorialPolicy)
        .set({ status: input.status })
        .where(eq(editorialPolicy.id, input.id))
        .returning();
      return result[0];
    }),

  editorialPolicyDelete: protectedProcedure
    .use(requirePermission("article:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(editorialPolicy).where(eq(editorialPolicy.id, input.id));
      return { success: true };
    }),

  editorialPolicyCount: protectedProcedure
    .use(requirePermission("article:update"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(editorialPolicy);
      return result[0]?.count ?? 0;
    }),

  contentReviewList: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z
        .object({
          status: z
            .enum(["pending", "approved", "rejected", "needs_revision"])
            .optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      if (input?.status)
        conditions.push(eq(contentReview.verdict, input.status));
      return db
        .select()
        .from(contentReview)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(contentReview.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  contentReviewById: protectedProcedure
    .use(requirePermission("article:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(contentReview)
        .where(eq(contentReview.id, input.id));
      return result[0] ?? null;
    }),

  contentReviewCreate: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z.object({
        contentId: z.string().min(1).max(50),
        contentType: z.string().min(1).max(50),
        verdict: z.enum(["pending", "approved", "rejected", "needs_revision"]),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(contentReview).values(input).returning();
      return result[0];
    }),

  contentReviewUpdate: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z.object({
        id: z.number(),
        verdict: z.enum(["pending", "approved", "rejected", "needs_revision"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(contentReview)
        .set({ verdict: input.verdict })
        .where(eq(contentReview.id, input.id))
        .returning();
      return result[0];
    }),

  contentReviewDelete: protectedProcedure
    .use(requirePermission("article:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(contentReview).where(eq(contentReview.id, input.id));
      return { success: true };
    }),

  contentReviewCount: protectedProcedure
    .use(requirePermission("article:update"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(contentReview);
      return result[0]?.count ?? 0;
    }),

  publicationScheduleList: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z
        .object({
          status: z.enum(["scheduled", "published", "cancelled"]).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      if (input?.status)
        conditions.push(eq(publicationSchedule.status, input.status));
      return db
        .select()
        .from(publicationSchedule)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(publicationSchedule.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  publicationScheduleById: protectedProcedure
    .use(requirePermission("article:update"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(publicationSchedule)
        .where(eq(publicationSchedule.id, input.id));
      return result[0] ?? null;
    }),

  publicationScheduleCreate: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z.object({
        title: z.string().min(1).max(256),
        scheduledDate: z.coerce.date(),
        contentType: z.string().optional(),
      }),
    )
    .mutation(async ({ _ctx, input }) => {
      const result = await db
        .insert(publicationSchedule)
        .values(input)
        .returning();
      return result[0];
    }),

  publicationScheduleUpdate: protectedProcedure
    .use(requirePermission("article:update"))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["scheduled", "published", "cancelled"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(publicationSchedule)
        .set({ status: input.status })
        .where(eq(publicationSchedule.id, input.id))
        .returning();
      return result[0];
    }),

  publicationScheduleDelete: protectedProcedure
    .use(requirePermission("article:update"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(publicationSchedule)
        .where(eq(publicationSchedule.id, input.id));
      return { success: true };
    }),

  publicationScheduleCount: protectedProcedure
    .use(requirePermission("article:update"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(publicationSchedule);
      return result[0]?.count ?? 0;
    }),
});
