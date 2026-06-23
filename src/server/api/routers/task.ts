import { z } from "zod";
import {
  taskSchema,
  taskStatuses,
  updateTaskSchema,
} from "@/lib/validations/execution";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const tasks = [
  {
    assignee: "Husam",
    description: "Create the Dream Center route and components.",
    dueDate: "2026-06-23",
    goalId: "goal-1",
    id: "task-1",
    parentGoalTitle: "Close Train K with 50/50 certification",
    priority: "Critical",
    status: "done",
    title: "Ship WP-K-01",
  },
] as const;

export const taskRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input }) => tasks.find((task) => task.id === input.id) ?? null),
  create: protectedProcedure
    .input(taskSchema)
    .mutation(({ input }) => ({ ...input, id: "task-created" })),
  list: protectedProcedure.query(() => tasks),
  recordOutcome: protectedProcedure
    .input(z.object({ id: z.string().min(1), outcome: z.string().min(1) }))
    .mutation(({ input }) => ({ ...input, status: "done" as const })),
  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(({ input }) => input),
  updateStatus: protectedProcedure
    .input(z.object({ id: z.string().min(1), status: z.enum(taskStatuses) }))
    .mutation(({ input }) => input),
});
