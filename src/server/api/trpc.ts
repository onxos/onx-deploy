import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { auth } from "@/server/auth";
import { normalizeRole, type Role } from "@/server/auth/rbac";

type ContextUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export const createTRPCContext = async (opts?: { req?: Request }) => {
  const forwardedFor = opts?.req?.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    opts?.req?.headers.get("x-real-ip") ??
    "local";
  const session = opts?.req
    ? await auth.api.getSession({ headers: opts.req.headers })
    : null;
  const user: ContextUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? "",
        role: normalizeRole(session.user.role),
      }
    : null;

  return {
    ...opts,
    ip,
    session,
    user,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createTRPCMiddleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});
