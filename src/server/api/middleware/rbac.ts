import { TRPCError } from "@trpc/server";
import { createTRPCMiddleware } from "@/server/api/trpc";
import {
  hasMinimumRole,
  hasPermission,
  type Permission,
  type Role,
} from "@/server/auth/rbac";

function requireAuthenticatedUser() {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "Authentication required",
  });
}

export function requireRole(minRole: Role) {
  return createTRPCMiddleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw requireAuthenticatedUser();
    }

    if (!hasMinimumRole(ctx.user.role, minRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `${minRole} role required`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
        session: ctx.session,
      },
    });
  });
}

export function requirePermission(permission: Permission) {
  return createTRPCMiddleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw requireAuthenticatedUser();
    }

    if (!hasPermission(ctx.user.role, permission)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `${permission} permission required`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
        session: ctx.session,
      },
    });
  });
}
