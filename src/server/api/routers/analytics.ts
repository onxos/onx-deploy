import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { visitorInteraction } from "@/server/db/schema/civilization";
import { titanConversation } from "@/server/db/schema/titan-conversation";

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const trackRateLimits = new Map<string, { count: number; resetAt: number }>();

export const analyticsRouter = createTRPCRouter({
  track: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        page: z.string(),
        action: z.enum(["view", "search", "click"]),
        query: z.string().optional(),
        metadata: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const now = Date.now();
      const current = trackRateLimits.get(ctx.ip);

      if (!current || current.resetAt <= now) {
        trackRateLimits.set(ctx.ip, {
          count: 1,
          resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
      } else if (current.count >= RATE_LIMIT_MAX) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "analytics.track limited to 100 requests per hour per IP",
        });
      } else {
        current.count += 1;
      }

      const interaction = await db
        .insert(visitorInteraction)
        .values(input)
        .returning();
      return interaction[0];
    }),

  getPageViews: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(
      z
        .object({
          page: z.string().optional(),
          days: z.number().default(30),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const since = new Date();
      since.setDate(since.getDate() - (input?.days ?? 30));
      return db
        .select({
          page: visitorInteraction.page,
          count: sql<number>`count(*)`,
        })
        .from(visitorInteraction)
        .where(
          and(
            eq(visitorInteraction.action, "view"),
            gte(visitorInteraction.createdAt, since),
          ),
        )
        .groupBy(visitorInteraction.page)
        .orderBy(desc(sql`count(*)`));
    }),

  getSearchAnalytics: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(z.object({ days: z.number().default(30) }).optional())
    .query(async ({ input }) => {
      const since = new Date();
      since.setDate(since.getDate() - (input?.days ?? 30));
      return db
        .select({
          query: visitorInteraction.query,
          count: sql<number>`count(*)`,
        })
        .from(visitorInteraction)
        .where(
          and(
            eq(visitorInteraction.action, "search"),
            gte(visitorInteraction.createdAt, since),
          ),
        )
        .groupBy(visitorInteraction.query)
        .orderBy(desc(sql`count(*)`));
    }),

  getCivilizationPulse: publicProcedure.query(async () => {
    const totalViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitorInteraction)
      .where(eq(visitorInteraction.action, "view"));
    const totalSearches = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitorInteraction)
      .where(eq(visitorInteraction.action, "search"));
    const topPages = await db
      .select({
        page: visitorInteraction.page,
        count: sql<number>`count(*)`,
      })
      .from(visitorInteraction)
      .groupBy(visitorInteraction.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
    return {
      totalViews: totalViews[0]?.count ?? 0,
      totalSearches: totalSearches[0]?.count ?? 0,
      topPages,
      generatedAt: new Date(),
    };
  }),

  getAiQueryMetrics: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const titanInteractions = await db
        .select({
          titanId: titanConversation.titanId,
          count: sql<number>`count(*)`,
        })
        .from(titanConversation)
        .groupBy(titanConversation.titanId)
        .orderBy(desc(sql`count(*)`));

      return {
        titanInteractions,
        generatedAt: new Date(),
      };
    }),

  getConclaveMetrics: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const totalConversations = await db
        .select({ count: sql<number>`count(*)` })
        .from(titanConversation);
      const byConfidence = await db
        .select({
          confidence: titanConversation.confidence,
          count: sql<number>`count(*)`,
        })
        .from(titanConversation)
        .groupBy(titanConversation.confidence);

      return {
        totalConversations: totalConversations[0]?.count ?? 0,
        byConfidence,
        generatedAt: new Date(),
      };
    }),
});
