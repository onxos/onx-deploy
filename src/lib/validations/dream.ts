import { z } from "zod";

export const dreamCategories = [
  "Personal",
  "Professional",
  "Spiritual",
  "Creative",
  "Social",
  "Other",
] as const;
export const dreamPriorities = ["Low", "Medium", "High", "Critical"] as const;
export const dreamStatuses = ["Draft", "Active", "Archived"] as const;

export const dreamSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  category: z.enum(dreamCategories),
  priority: z.enum(dreamPriorities),
  status: z.enum(dreamStatuses).default("Draft"),
});

export const updateDreamSchema = dreamSchema.partial().extend({
  id: z.string().min(1),
});

export type DreamInput = z.infer<typeof dreamSchema>;
export type DreamStatus = (typeof dreamStatuses)[number];
export type DreamPriority = (typeof dreamPriorities)[number];
export type DreamCategory = (typeof dreamCategories)[number];
