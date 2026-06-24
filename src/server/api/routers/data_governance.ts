import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { dataGovernanceRule, dataQualityCheck } from "@/server/db/schema";

export const data_governanceRouter = createTRPCRouter({
  dataGovernanceRuleList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["active", "draft", "deprecated"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(dataGovernanceRule.status, input.status));
      return db.select().from(dataGovernanceRule).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(dataGovernanceRule.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  dataGovernanceRuleById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(dataGovernanceRule).where(eq(dataGovernanceRule.id, input.id));
      return result[0] ?? null;
    }),

  dataGovernanceRuleCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      name: z.string().min(1).max(256),
      scope: z.string().min(1).max(100),
      rule: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(dataGovernanceRule).values(input).returning();
      return result[0];
    }),

  dataGovernanceRuleUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["active", "draft", "deprecated"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(dataGovernanceRule).set({ status: input.status }).where(eq(dataGovernanceRule.id, input.id)).returning();
      return result[0];
    }),

  dataGovernanceRuleDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(dataGovernanceRule).where(eq(dataGovernanceRule.id, input.id));
      return { success: true };
    }),

  dataGovernanceRuleCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(dataGovernanceRule);
      return result[0]?.count ?? 0;
    }),

  dataQualityCheckList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(dataQualityCheck).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(dataQualityCheck.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  dataQualityCheckById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(dataQualityCheck).where(eq(dataQualityCheck.id, input.id));
      return result[0] ?? null;
    }),

  dataQualityCheckCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      tableName: z.string().min(1).max(100),
      checkType: z.string().min(1).max(50),
      passed: z.boolean(),
      details: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(dataQualityCheck).values(input).returning();
      return result[0];
    }),

  dataQualityCheckDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(dataQualityCheck).where(eq(dataQualityCheck.id, input.id));
      return { success: true };
    }),

  dataQualityCheckCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(dataQualityCheck);
      return result[0]?.count ?? 0;
    }),

});