import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { titanRegistry } from "@/server/db/schema/civilization";

export const titanRouter = createTRPCRouter({
  listTitans: publicProcedure.query(async () => {
    return db.query.titanRegistry.findMany({
      orderBy: [asc(titanRegistry.number)],
    });
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
