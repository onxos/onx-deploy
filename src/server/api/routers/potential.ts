import { z } from "zod";
import { potentials } from "@/lib/civilization/lifecycle-records";
import {
  potentialSchema,
  updatePotentialSchema,
} from "@/lib/validations/potential";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const potentialRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(
      ({ input }) =>
        potentials.find((potential) => potential.id === input.id) ?? null,
    ),
  create: protectedProcedure
    .input(potentialSchema)
    .mutation(({ input }) => ({ ...input, id: "potential-created" })),
  list: protectedProcedure.query(() => potentials),
  markForConversion: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input }) => ({ conversionReady: true, id: input.id })),
  update: protectedProcedure
    .input(updatePotentialSchema)
    .mutation(({ input }) => input),
});
