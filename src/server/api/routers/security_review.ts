import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { securityAudit, vulnerabilityTracking } from "@/server/db/schema";

export const security_reviewRouter = createTRPCRouter({
  securityAuditList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(securityAudit.status, input.status));
      return db.select().from(securityAudit).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(securityAudit.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  securityAuditById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(securityAudit).where(eq(securityAudit.id, input.id));
      return result[0] ?? null;
    }),

  securityAuditCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      auditType: z.string().min(1).max(50),
      target: z.string().min(1).max(256),
      findings: z.string().optional(),
      severity: z.string().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(securityAudit).values(input).returning();
      return result[0];
    }),

  securityAuditUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["open", "in_progress", "resolved", "closed"]) }))
    .mutation(async ({ input }) => {
      const result = await db.update(securityAudit).set({ status: input.status }).where(eq(securityAudit.id, input.id)).returning();
      return result[0];
    }),

  securityAuditDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(securityAudit).where(eq(securityAudit.id, input.id));
      return { success: true };
    }),

  securityAuditCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(securityAudit);
      return result[0]?.count ?? 0;
    }),

  vulnerabilityTrackingList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.enum(["open", "mitigated", "resolved", "accepted"]).optional(), limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(vulnerabilityTracking.status, input.status));
      return db.select().from(vulnerabilityTracking).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(vulnerabilityTracking.id)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    }),

  vulnerabilityTrackingById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(vulnerabilityTracking).where(eq(vulnerabilityTracking.id, input.id));
      return result[0] ?? null;
    }),

  vulnerabilityTrackingCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({
      cveId: z.string().optional(),
      title: z.string().min(1).max(256),
      description: z.string().optional(),
      severity: z.enum(["low", "medium", "high", "critical"]).optional(),
      remediation: z.string().optional(),
    }))
    .mutation(async ({ _ctx, input }) => {
      const result = await db.insert(vulnerabilityTracking).values(input).returning();
      return result[0];
    }),

  vulnerabilityTrackingUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number(), status: z.enum(["open", "mitigated", "resolved", "accepted"]) }))
    .mutation(async ({ input }) => {
      const result = await db.update(vulnerabilityTracking).set({ status: input.status }).where(eq(vulnerabilityTracking.id, input.id)).returning();
      return result[0];
    }),

  vulnerabilityTrackingDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(vulnerabilityTracking).where(eq(vulnerabilityTracking.id, input.id));
      return { success: true };
    }),

  vulnerabilityTrackingCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db.select({ count: sql<number>`count(*)` }).from(vulnerabilityTracking);
      return result[0]?.count ?? 0;
    }),

});