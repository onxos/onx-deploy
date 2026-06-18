import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { hasAdminAccessFromHeaders } from "@/server/admin-auth";

export const createTRPCContext = (opts?: { req?: Request }) => {
  const forwardedFor = opts?.req?.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    opts?.req?.headers.get("x-real-ip") ??
    "local";

  return {
    ...opts,
    ip,
    isAdmin: hasAdminAccessFromHeaders(opts?.req?.headers),
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
export const publicProcedure = t.procedure;
// Temporary Wave 4 admin gate. Replace with Better Auth role checks when sessions are wired.
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Admin access token required",
    });
  }

  return next({ ctx });
});
