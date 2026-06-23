import { z } from "zod";
import { tasks } from "@/lib/civilization/lifecycle-records";
import {
  taskSchema,
  taskStatuses,
  updateTaskSchema,
} from "@/lib/validations/execution";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
