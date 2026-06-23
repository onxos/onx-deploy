import { z } from "zod";
import { getOutcomeReviewSummary } from "@/lib/outcomes/outcome-records";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const outcomeInput = z.object({
  evidenceLinks: z.array(z.string().min(1)).min(1),
  goalId: z.string().min(1),
  impact: z.string().min(1).max(1000),
  stakeholder: z.string().min(1).max(120),
  summary: z.string().min(1).max(1000),
  title: z.string().min(1).max(200),
});

export const outcomeRouter = createTRPCRouter({
  createOutcome: protectedProcedure
    .input(outcomeInput)
    .mutation(({ input }) => ({
      ...input,
      id: "outcome-created",
      qualityScore: 90,
    })),
  getReviewSummary: protectedProcedure.query(() => getOutcomeReviewSummary()),
});
