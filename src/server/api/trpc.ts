import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

export const createTRPCContext = (opts?: { req?: Request }) => {
  return { ...opts };
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
// Wave 4: replace with better-auth session check
export const protectedProcedure = t.procedure;
