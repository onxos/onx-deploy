import { z } from "zod";

export const understandingTypes = ["research", "analysis", "insight"] as const;
export const confidenceLevels = ["Low", "Medium", "High", "Certain"] as const;

export const linkedEntitySchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(["dream", "goal"]),
  label: z.string().min(1),
});

export const understandingSchema = z.object({
  type: z.enum(understandingTypes),
  content: z.string().min(1).max(2000),
  linkedEntity: linkedEntitySchema,
  notes: z.string().max(2000).optional(),
});

export const judgmentSchema = z.object({
  verdict: z.string().min(1).max(300),
  confidence: z.enum(confidenceLevels),
  rationale: z.string().min(1).max(2000),
  linkedEntity: linkedEntitySchema,
  evidence: z.string().max(2000).optional(),
});

export const updateUnderstandingSchema = understandingSchema.partial().extend({
  id: z.string().min(1),
});
export const updateJudgmentSchema = judgmentSchema.partial().extend({
  id: z.string().min(1),
});

export type UnderstandingType = (typeof understandingTypes)[number];
export type ConfidenceLevel = (typeof confidenceLevels)[number];
