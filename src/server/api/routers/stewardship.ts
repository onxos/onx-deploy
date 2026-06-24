import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { stewardshipRecord, continuityPlan } from "@/server/db/schema";

export const stewardshipRouter = createTRPCRouter({
  stewardshipRecordList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["active", "transitioning", "handed_off"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(stewardshipRecord.status, input.status));
      return db.select().from(stewardshipRecord).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(stewardshipRecord.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  stewardshipRecordById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(stewardshipRecord).where(eq(stewardshipRecord.id, input.id));
      return result[0] ?? null;
    }),

  stewardshipRecordCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      responsibility: z.string().min(1).max(256),
      scope: z.string().optional(),
      handoffNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(stewardshipRecord).values(input).returning();
      return result[0];
    }),

  stewardshipRecordUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["active", "transitioning", "handed_off"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(stewardshipRecord).set({ status: input.status }).where(eq(stewardshipRecord.id, input.id)).returning();
      return result[0];
    }),

  stewardshipRecordDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(stewardshipRecord).where(eq(stewardshipRecord.id, input.id));
      return { success: true };
    }),

  stewardshipRecordCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(stewardshipRecord);
      return result[0]?.count ?? 0;
    }),

  continuityPlanList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["draft", "reviewed", "approved", "tested"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(continuityPlan.status, input.status));
      return db.select().from(continuityPlan).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(continuityPlan.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  continuityPlanById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(continuityPlan).where(eq(continuityPlan.id, input.id));
      return result[0] ?? null;
    }),

  continuityPlanCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      name: z.string().min(1).max(256),
      scenario: z.string().min(1).max(256),
      plan: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(continuityPlan).values(input).returning();
      return result[0];
    }),

  continuityPlanUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["draft", "reviewed", "approved", "tested"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(continuityPlan).set({ status: input.status }).where(eq(continuityPlan.id, input.id)).returning();
      return result[0];
    }),

  continuityPlanDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(continuityPlan).where(eq(continuityPlan.id, input.id));
      return { success: true };
    }),

  continuityPlanCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(continuityPlan);
      return result[0]?.count ?? 0;
    }),

});