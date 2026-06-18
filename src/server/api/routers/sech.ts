import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { sechStatusLog } from "@/server/db/schema/civilization";

const SECH_LAYERS = ["S", "E", "C", "H", "Council"] as const;
type SechCurrentStatus = {
  layer: (typeof SECH_LAYERS)[number];
  status: string;
  message: string | null;
  lastUpdate: Date | null;
};

let sechStatusCache:
  | {
      expiresAt: number;
      data: SechCurrentStatus[];
    }
  | undefined;

export const sechRouter = createTRPCRouter({
  getCurrentStatus: publicProcedure.query(async () => {
    if (sechStatusCache && sechStatusCache.expiresAt > Date.now()) {
      return sechStatusCache.data;
    }

    const statuses = await Promise.all(
      SECH_LAYERS.map(async (layer) => {
        const latest = await db.query.sechStatusLog.findFirst({
          where: eq(sechStatusLog.layer, layer),
          orderBy: [desc(sechStatusLog.createdAt)],
        });
        return {
          layer,
          status: latest?.status ?? "clear",
          message: latest?.message ?? null,
          lastUpdate: latest?.createdAt ?? null,
        };
      }),
    );
    sechStatusCache = {
      data: statuses,
      expiresAt: Date.now() + 30 * 1000,
    };
    return statuses;
  }),

  getLayerHistory: publicProcedure
    .input(
      z.object({
        layer: z.enum(SECH_LAYERS),
        limit: z.number().default(50),
      }),
    )
    .query(async ({ input }) => {
      return db.query.sechStatusLog.findMany({
        where: eq(sechStatusLog.layer, input.layer),
        orderBy: [desc(sechStatusLog.createdAt)],
        limit: input.limit,
      });
    }),

  setLayerStatus: protectedProcedure
    .input(
      z.object({
        layer: z.enum(SECH_LAYERS),
        status: z.enum(["clear", "advisory", "alert", "veto"]),
        message: z.string().optional(),
        triggeredBy: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const log = await db.insert(sechStatusLog).values(input).returning();
      sechStatusCache = undefined;
      return log[0];
    }),

  verifyFeature: publicProcedure
    .input(z.object({ featureName: z.string() }))
    .query(async ({ input }) => {
      const layerStatuses = await Promise.all(
        SECH_LAYERS.map(async (layer) => {
          return db.query.sechStatusLog.findFirst({
            where: eq(sechStatusLog.layer, layer),
            orderBy: [desc(sechStatusLog.createdAt)],
          });
        }),
      );
      const allClear = layerStatuses.every((s) => !s || s.status === "clear");
      return {
        feature: input.featureName,
        approved: allClear,
        layerStatuses,
      };
    }),
});
