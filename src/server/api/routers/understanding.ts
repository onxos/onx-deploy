import { z } from "zod";
import {
  understandingSchema,
  updateUnderstandingSchema,
} from "@/lib/validations/workspace";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const understanding = [
  {
    content: "Dreams become executable when the first next action is visible.",
    id: "understanding-1",
    linkedEntity: {
      entityId: "dream-1",
      entityType: "dream",
      label: "Build the ONX core experience",
    },
    notes: "Evidence discipline is part of the operating layer.",
    type: "insight",
  },
] as const;

export const understandingRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(
      ({ input }) => understanding.find((item) => item.id === input.id) ?? null,
    ),
  create: protectedProcedure
    .input(understandingSchema)
    .mutation(({ input }) => ({ ...input, id: "understanding-created" })),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input }) => ({ ok: true as const, ...input })),
  list: protectedProcedure.query(() => understanding),
  update: protectedProcedure
    .input(updateUnderstandingSchema)
    .mutation(({ input }) => input),
});
