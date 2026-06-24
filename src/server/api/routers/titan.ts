import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { defaultTitanPersonas } from "@/lib/ai/persona-loader";
import { converseWithTitan } from "@/lib/ai/titan-conversation";
import { createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/server/db";
import { titanRegistry } from "@/server/db/schema/civilization";
import { titanConversation } from "@/server/db/schema/titan-conversation";

let titanCache:
  | {
      expiresAt: number;
      data: Awaited<ReturnType<typeof db.query.titanRegistry.findMany>>;
    }
  | undefined;

export const titanRouter = createTRPCRouter({
  converse: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(1),
        titanId: z.string().min(1),
        message: z.string().min(1).max(4000),
      }),
    )
    .mutation(async ({ input }) => {
      return converseWithTitan(input);
    }),

  getPersona: publicProcedure
    .input(z.object({ titanId: z.string().min(1) }))
    .query(({ input }) => {
      return (
        defaultTitanPersonas.find(
          (persona) => persona.titanId === input.titanId,
        ) ?? null
      );
    }),

  updatePersona: publicProcedure
    .input(
      z.object({
        titanId: z.string().min(1),
        displayName: z.string().min(1),
        domain: z.string().min(1),
        style: z.string().min(1),
        traits: z.array(z.string()).default([]),
        systemPrompt: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      return { ...input, status: "accepted-for-seed" as const };
    }),

  chatHistory: publicProcedure
    .input(
      z.object({ sessionId: z.string().min(1), limit: z.number().default(25) }),
    )
    .query(async ({ input }) => {
      return db.query.titanConversation.findMany({
        where: eq(titanConversation.sessionId, input.sessionId),
        orderBy: [asc(titanConversation.createdAt)],
        limit: input.limit,
      });
    }),

  listTitans: publicProcedure.query(async () => {
    if (titanCache && titanCache.expiresAt > Date.now()) {
      return titanCache.data;
    }

    const data = await db.query.titanRegistry.findMany({
      orderBy: [asc(titanRegistry.number)],
    });
    titanCache = { data, expiresAt: Date.now() + 5 * 60 * 1000 };
    return data;
  }),

  getTitan: publicProcedure
    .input(z.object({ number: z.number().min(1).max(100) }))
    .query(async ({ input }) => {
      return db.query.titanRegistry.findFirst({
        where: eq(titanRegistry.number, input.number),
      });
    }),

  getTitanByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return db.query.titanRegistry.findFirst({
        where: eq(titanRegistry.name, input.name),
      });
    }),
});
