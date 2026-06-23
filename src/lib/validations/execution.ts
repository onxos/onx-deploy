import { z } from "zod";
import { dreamPriorities } from "./dream";

export const taskStatuses = ["todo", "in-progress", "done", "blocked"] as const;

export const taskSchema = z.object({
  goalId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  status: z.enum(taskStatuses),
  priority: z.enum(dreamPriorities),
  dueDate: z.string().min(1),
  assignee: z.string().min(1),
  outcome: z.string().max(2000).optional(),
});

export const updateTaskSchema = taskSchema.partial().extend({
  id: z.string().min(1),
});

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskInput = z.infer<typeof taskSchema>;
