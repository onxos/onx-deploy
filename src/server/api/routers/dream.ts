import { z } from "zod";
import { dreamSchema, updateDreamSchema } from "@/lib/validations/dream";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const dreams = [
  {
    category: "Professional",
    createdAt: "2026-06-22",
    description: "Create the ONX Dream-to-Goal operating layer.",
    id: "dream-1",
    priority: "Critical",
    status: "Active",
    title: "Build the ONX core experience",
    updatedAt: "2026-06-22",
  },
] as const;

export const dreamRouter = createTRPCRouter({
  archive: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input }) => ({ id: input.id, status: "Archived" as const })),
  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(
      ({ input }) => dreams.find((dream) => dream.id === input.id) ?? null,
    ),
  create: protectedProcedure
    .input(dreamSchema)
    .mutation(({ input }) => ({ ...input, id: "dream-created" })),
  list: protectedProcedure.query(() => dreams),
  update: protectedProcedure.input(updateDreamSchema).mutation(({ input }) => ({
    ...input,
    updatedAt: new Date().toISOString(),
  })),
});
