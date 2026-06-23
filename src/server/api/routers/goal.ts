import { z } from "zod";
import {
  goalSchema,
  milestoneSchema,
  updateGoalSchema,
} from "@/lib/validations/goal";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const goals = [
  {
    childGoals: ["Instrument evidence automation"],
    deadline: "2026-06-30",
    description: "Convert Train K into a complete operating layer.",
    id: "goal-1",
    milestones: [
      {
        completed: true,
        dueDate: "2026-06-23",
        id: "m1",
        title: "Model dream",
      },
    ],
    priority: "Critical",
    status: "Active",
    title: "Close Train K with 50/50 certification",
  },
] as const;

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
