import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { auth } from "@/server/auth";
import { loginInputSchema, loginWithEmailPassword } from "@/server/auth/login";
import { logoutFromHeaders } from "@/server/auth/logout";
import {
  getCapturedPasswordResetLinks,
  passwordResetInputSchema,
  passwordResetRequestInputSchema,
  requestPasswordReset,
  resetPassword,
} from "@/server/auth/password-reset";
import { ROLES, type Role } from "@/server/auth/rbac";
import { registerInputSchema, toRegisterBody } from "@/server/auth/register";
import {
  getSessionFromHeaders,
  refreshSessionFromHeaders,
} from "@/server/auth/session";
import { db } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }
  return "Registration failed";
}

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerInputSchema)
    .output(
      z.object({
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          role: z.string().nullable(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await auth.api.signUpEmail({
          body: toRegisterBody(input),
        });

        return {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role ?? "operator",
          },
        };
      } catch (error) {
        const message = getErrorMessage(error);
        const isDuplicate =
          message.toLowerCase().includes("already") ||
          message.toLowerCase().includes("unique") ||
          message.toLowerCase().includes("duplicate");

        throw new TRPCError({
          code: isDuplicate ? "CONFLICT" : "BAD_REQUEST",
          message: isDuplicate ? "Email is already registered" : message,
        });
      }
    }),
  login: publicProcedure
    .input(loginInputSchema)
    .output(
      z.object({
        token: z.string(),
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          role: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => loginWithEmailPassword(input)),
  session: publicProcedure
    .output(
      z.object({
        token: z.string(),
        expiresAt: z.date(),
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          role: z.string(),
        }),
      }),
    )
    .query(async ({ ctx }) => {
      if (!ctx.req) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      return getSessionFromHeaders(ctx.req.headers);
    }),
  refresh: publicProcedure
    .output(
      z.object({
        token: z.string(),
        expiresAt: z.date(),
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          role: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx }) => {
      if (!ctx.req) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
      }

      return refreshSessionFromHeaders(ctx.req.headers);
    }),
  logout: publicProcedure
    .output(z.object({ ok: z.literal(true) }))
    .mutation(async ({ ctx }) => {
      if (!ctx.req) {
        return { ok: true as const };
      }

      return logoutFromHeaders(ctx.req.headers);
    }),
  requestPasswordReset: publicProcedure
    .input(passwordResetRequestInputSchema)
    .output(z.object({ ok: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      const baseUrl = ctx.req
        ? new URL(ctx.req.url).origin
        : (process.env.BETTER_AUTH_URL ?? "http://localhost:3000");
      return requestPasswordReset(input, baseUrl);
    }),
  resetPassword: publicProcedure
    .input(passwordResetInputSchema)
    .output(z.object({ ok: z.literal(true) }))
    .mutation(async ({ input }) => resetPassword(input)),
  resetLinks: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .output(
      z.object({
        links: z.array(
          z.object({
            userId: z.string(),
            email: z.string(),
            url: z.string(),
            token: z.string().nullable(),
            createdAt: z.date(),
          }),
        ),
      }),
    )
    .query(() => ({ links: getCapturedPasswordResetLinks() })),
  updateRole: protectedProcedure
    .use(requirePermission("user:updateRole"))
    .input(
      z.object({
        userId: z.string().min(1),
        role: z.enum(ROLES),
      }),
    )
    .output(
      z.object({
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          role: z.enum(ROLES),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, input.userId))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: (updated.role ?? "operator") as Role,
        },
      };
    }),
});
