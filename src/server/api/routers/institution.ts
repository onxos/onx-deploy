import { and, desc, eq, type SQL, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { institutionSetting, memberManagement } from "@/server/db/schema";

export const institutionRouter = createTRPCRouter({
  institutionSettingList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(
      z
        .object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      return db
        .select()
        .from(institutionSetting)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(institutionSetting.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  institutionSettingById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(institutionSetting)
        .where(eq(institutionSetting.id, input.id));
      return result[0] ?? null;
    }),

  institutionSettingCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(
      z.object({
        key: z.string().min(1).max(100),
        value: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(institutionSetting)
        .values(input)
        .returning();
      return result[0];
    }),

  institutionSettingDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(institutionSetting)
        .where(eq(institutionSetting.id, input.id));
      return { success: true };
    }),

  institutionSettingCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(institutionSetting);
      return result[0]?.count ?? 0;
    }),

  memberManagementList: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(
      z
        .object({
          status: z.enum(["active", "inactive", "suspended"]).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions: SQL[] = [];
      if (input?.status)
        conditions.push(eq(memberManagement.status, input.status));
      return db
        .select()
        .from(memberManagement)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(memberManagement.id))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  memberManagementById: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(memberManagement)
        .where(eq(memberManagement.id, input.id));
      return result[0] ?? null;
    }),

  memberManagementCreate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(
      z.object({
        userId: z.string().min(1),
        role: z.string().min(1).max(20),
        department: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(memberManagement)
        .values(input)
        .returning();
      return result[0];
    }),

  memberManagementUpdate: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["active", "inactive", "suspended"]),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(memberManagement)
        .set({ status: input.status })
        .where(eq(memberManagement.id, input.id))
        .returning();
      return result[0];
    }),

  memberManagementDelete: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(memberManagement)
        .where(eq(memberManagement.id, input.id));
      return { success: true };
    }),

  memberManagementCount: protectedProcedure
    .use(requirePermission("admin:read"))
    .query(async () => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(memberManagement);
      return result[0]?.count ?? 0;
    }),
});
