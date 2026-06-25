import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { onboardingFlow, trainingMaterial } from "@/server/db/schema";

export const enablementRouter = createTRPCRouter({
  trainingMaterialList: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z
        .object({
          status: z.enum(["draft", "published", "archived"]).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status)
        conditions.push(eq(trainingMaterial.status, input.status));
      return db
        .select()
        .from(trainingMaterial)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(trainingMaterial.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  trainingMaterialById: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(trainingMaterial)
        .where(eq(trainingMaterial.id, input.id));
      return result[0] ?? null;
    }),

  trainingMaterialCreate: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z.object({
        title: z.string().min(1).max(256),
        content: z.string().min(1),
        category: z.string().optional(),
        difficulty: z.string().optional(),
      }),
    )
    .mutation(async ({ _ctx, input }) => {
      const result = await db
        .insert(trainingMaterial)
        .values(input)
        .returning();
      return result[0];
    }),

  trainingMaterialUpdate: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "published", "archived"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(trainingMaterial)
        .set({ status: input.status })
        .where(eq(trainingMaterial.id, input.id))
        .returning();
      return result[0];
    }),

  trainingMaterialDelete: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(trainingMaterial)
        .where(eq(trainingMaterial.id, input.id));
      return { success: true };
    }),

  trainingMaterialCount: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(trainingMaterial);
      return result[0]?.count ?? 0;
    }),

  onboardingFlowList: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z
        .object({
          status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status)
        conditions.push(eq(onboardingFlow.status, input.status));
      return db
        .select()
        .from(onboardingFlow)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(onboardingFlow.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  onboardingFlowById: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(onboardingFlow)
        .where(eq(onboardingFlow.id, input.id));
      return result[0] ?? null;
    }),

  onboardingFlowCreate: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z.object({
        userId: z.string().min(1),
        totalSteps: z.number().optional(),
      }),
    )
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(onboardingFlow).values(input).returning();
      return result[0];
    }),

  onboardingFlowUpdate: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["in_progress", "completed", "abandoned"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(onboardingFlow)
        .set({ status: input.status })
        .where(eq(onboardingFlow.id, input.id))
        .returning();
      return result[0];
    }),

  onboardingFlowDelete: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(onboardingFlow).where(eq(onboardingFlow.id, input.id));
      return { success: true };
    }),

  onboardingFlowCount: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(onboardingFlow);
      return result[0]?.count ?? 0;
    }),
});
