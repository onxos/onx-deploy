import { z } from "zod";
import {
  judgmentSchema,
  updateJudgmentSchema,
} from "@/lib/validations/workspace";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const judgments = [
  {
    confidence: "High",
    evidence: "Train K has 50 binary criteria.",
    id: "judgment-1",
    linkedEntity: {
      entityId: "goal-1",
      entityType: "goal",
      label: "Close Train K",
    },
    rationale: "Scope is concrete enough to execute.",
    verdict: "Proceed sequentially",
  },
] as const;

export const judgmentRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(
      ({ input }) => judgments.find((item) => item.id === input.id) ?? null,
    ),
  create: protectedProcedure
    .input(judgmentSchema)
    .mutation(({ input }) => ({ ...input, id: "judgment-created" })),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ input }) => ({ ok: true as const, ...input })),
  list: protectedProcedure.query(() => judgments),
  update: protectedProcedure
    .input(updateJudgmentSchema)
    .mutation(({ input }) => input),
});
