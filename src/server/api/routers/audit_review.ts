import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { auditLog, complianceCheck } from "@/server/db/schema";

export const audit_reviewRouter = createTRPCRouter({
  auditLogList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      return db.select().from(auditLog).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(auditLog.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  auditLogById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(auditLog).where(eq(auditLog.id, input.id));
      return result[0] ?? null;
    }),

  auditLogCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      action: z.string().min(1).max(100),
      resource: z.string().min(1).max(100),
      resourceId: z.string().optional(),
      details: z.string().optional(),
      ipAddress: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(auditLog).values(input).returning();
      return result[0];
    }),

  auditLogDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(auditLog).where(eq(auditLog.id, input.id));
      return { success: true };
    }),

  auditLogCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(auditLog);
      return result[0]?.count ?? 0;
    }),

  complianceCheckList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["pass", "fail", "partial", "not_applicable"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }}).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(complianceCheck.status, input.status));
      return db.select().from(complianceCheck).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(complianceCheck.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  complianceCheckById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(complianceCheck).where(eq(complianceCheck.id, input.id));
      return result[0] ?? null;
    }),

  complianceCheckCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      name: z.string().min(1).max(256),
      standard: z.string().min(1).max(100),
      result: z.enum(["pass", "fail", "partial", "not_applicable"]),
      findings: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.insert(complianceCheck).values(input).returning();
      return result[0];
    }),

  complianceCheckUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["pass", "fail", "partial", "not_applicable"]) }}))
    .mutation(async ({ input }) => {
      const result = await db.update(complianceCheck).set({ status: input.status }).where(eq(complianceCheck.id, input.id)).returning();
      return result[0];
    }),

  complianceCheckDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(complianceCheck).where(eq(complianceCheck.id, input.id));
      return { success: true };
    }),

  complianceCheckCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(complianceCheck);
      return result[0]?.count ?? 0;
    }),

});