import { z } from "zod";

export const feasibilityRatings = ["High", "Medium", "Low"] as const;
export const potentialCategories = [
  "Growth",
  "Service",
  "Learning",
  "Creation",
  "Relationship",
  "Other",
] as const;

export const potentialSchema = z.object({
  dreamId: z.string().min(1),
  description: z.string().min(1, "Description is required").max(2000),
  assessmentScore: z.number().min(0).max(100),
  feasibility: z.enum(feasibilityRatings),
  category: z.enum(potentialCategories),
  conversionReady: z.boolean().default(false),
});

export const updatePotentialSchema = potentialSchema.partial().extend({
  id: z.string().min(1),
});

export type FeasibilityRating = (typeof feasibilityRatings)[number];
export type PotentialInput = z.infer<typeof potentialSchema>;
