import { and, asc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { forbidden, notFound } from "@/server/api/errors";
import { requirePermission } from "@/server/api/middleware/rbac";
import {
  userDeleteInputSchema,
  userListInputSchema,
  userListOutputSchema,
  userOutputSchema,
  userUpdateRoleInputSchema,
} from "@/server/api/routers/user-contract";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Role } from "@/server/auth/rbac";
import { db } from "@/server/db";
import { user } from "@/server/db/schema/auth";

function toUserOutput(row: typeof user.$inferSelect) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: (row.role ?? "operator") as Role,
    banned: row.banned,
    createdAt: row.createdAt,
  };
}

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(userListInputSchema)
    .output(userListOutputSchema)
    .query(async ({ input }) => {
      const filters = [];

      if (input?.role) {
        filters.push(eq(user.role, input.role));
      }

      if (input?.query) {
        filters.push(
          or(
            ilike(user.email, `%${input.query}%`),
            ilike(user.name, `%${input.query}%`),
          ),
        );
      }

      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const users = await db
        .select()
        .from(user)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(asc(user.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        users: users.map(toUserOutput),
        pagination: { limit, offset },
      };
    }),

  updateRole: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(userUpdateRoleInputSchema)
    .output(z.object({ user: userOutputSchema }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId && input.role !== "founder") {
        throw forbidden("Administrators cannot demote their own account");
      }

      const [updated] = await db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, input.userId))
        .returning();

      if (!updated) {
        throw notFound("User");
      }

      return { user: toUserOutput(updated) };
    }),

  delete: protectedProcedure
    .use(requirePermission("user:delete"))
    .input(userDeleteInputSchema)
    .output(z.object({ ok: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId) {
        throw forbidden("Administrators cannot delete their own account");
      }

      const [deleted] = await db
        .delete(user)
        .where(eq(user.id, input.userId))
        .returning({ id: user.id });

      if (!deleted) {
        throw notFound("User");
      }

      return { ok: true as const };
    }),
});
