import { z } from "zod";
import { dreamPriorities } from "./dream";

export const goalStatuses = [
  "Active",
  "Paused",
  "Completed",
  "Abandoned",
] as const;

export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  dueDate: z.string().min(1),
  completed: z.boolean(),
});

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1).max(2000),
  potentialId: z.string().optional(),
  parentGoalId: z.string().optional(),
  deadline: z.string().min(1, "invalid deadline"),
  priority: z.enum(dreamPriorities),
  status: z.enum(goalStatuses),
  milestones: z.array(milestoneSchema).default([]),
});

export const updateGoalSchema = goalSchema.partial().extend({
  id: z.string().min(1),
});

export type GoalStatus = (typeof goalStatuses)[number];
export type Milestone = z.infer<typeof milestoneSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
