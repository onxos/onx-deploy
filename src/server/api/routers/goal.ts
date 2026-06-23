import { z } from "zod";
import { goals } from "@/lib/civilization/lifecycle-records";
import {
  goalSchema,
  milestoneSchema,
  updateGoalSchema,
} from "@/lib/validations/goal";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const goalRouter = createTRPCRouter({
  addMilestone: protectedProcedure
    .input(z.object({ goalId: z.string().min(1), milestone: milestoneSchema }))
    .mutation(({ input }) => input),
  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input }) => goals.find((goal) => goal.id === input.id) ?? null),
  create: protectedProcedure
    .input(goalSchema)
    .mutation(({ input }) => ({ ...input, id: "goal-created" })),
  list: protectedProcedure.query(() => goals),
  update: protectedProcedure
    .input(updateGoalSchema)
    .mutation(({ input }) => input),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["Active", "Paused", "Completed", "Abandoned"]),
      }),
    )
    .mutation(({ input }) => input),
});
