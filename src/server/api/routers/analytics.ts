import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import {
  analyticsQueryInputSchema,
  assertAnalyticsDateRange,
  getDateTruncUnit,
} from "@/server/api/routers/analytics-query-contract";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  nonEmptyTrimmedString,
  optionalTrimmedString,
  pagePathSchema,
} from "@/server/api/validation";
import { db } from "@/server/db";
import { visitorInteraction } from "@/server/db/schema/civilization";
import { titanConversation } from "@/server/db/schema/titan-conversation";

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const trackRateLimits = new Map<string, { count: number; resetAt: number }>();

export const analyticsRouter = createTRPCRouter({
  query: protectedProcedure
    .use(requirePermission("analytics:read"))
    .input(analyticsQueryInputSchema.optional())
    .query(async ({ input }) => {
      const filters = [];
      const resolvedInput = analyticsQueryInputSchema.parse(input ?? {});
      assertAnalyticsDateRange(resolvedInput);

      if (resolvedInput.startDate) {
        filters.push(
          gte(visitorInteraction.createdAt, resolvedInput.startDate),
        );
      }

      if (resolvedInput.endDate) {
        filters.push(lte(visitorInteraction.createdAt, resolvedInput.endDate));
      }

      if (resolvedInput.metric === "pageViews") {
        filters.push(eq(visitorInteraction.action, "view"));
      }

      if (resolvedInput.metric === "errors") {
        filters.push(eq(visitorInteraction.action, "error"));
      }

      const dateBucket = sql<string>`date_trunc(${getDateTruncUnit(resolvedInput.granularity)}, ${visitorInteraction.createdAt})`;
      const valueExpression =
        resolvedInput.metric === "sessions"
          ? sql<number>`count(distinct ${visitorInteraction.sessionId})`
          : sql<number>`count(*)`;

      const rows = await db
        .select({
          date: sql<string>`to_char(${dateBucket}, 'YYYY-MM-DD')`,
          value: valueExpression,
        })
        .from(visitorInteraction)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .groupBy(dateBucket)
        .orderBy(asc(dateBucket))
        .limit(resolvedInput.limit)
        .offset(resolvedInput.offset);

      return rows.map((row) => ({
        date: row.date,
        value: Number(row.value),
      }));
    }),

  track: publicProcedure
    .input(
      z.object({
        sessionId: nonEmptyTrimmedString(256),
        page: pagePathSchema,
        action: z.enum(["view", "search", "click", "error"]),
        query: optionalTrimmedString(500),
        metadata: optionalTrimmedString(2_000),
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
    const [totalViews, totalSearches, topPages] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(visitorInteraction)
        .where(eq(visitorInteraction.action, "view")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(visitorInteraction)
        .where(eq(visitorInteraction.action, "search")),
      db
        .select({
          page: visitorInteraction.page,
          count: sql<number>`count(*)`,
        })
        .from(visitorInteraction)
        .groupBy(visitorInteraction.page)
        .orderBy(desc(sql`count(*)`))
        .limit(10),
    ]);
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
      const [totalConversations, byConfidence] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(titanConversation),
        db
          .select({
            confidence: titanConversation.confidence,
            count: sql<number>`count(*)`,
          })
          .from(titanConversation)
          .groupBy(titanConversation.confidence),
      ]);

      return {
        totalConversations: totalConversations[0]?.count ?? 0,
        byConfidence,
        generatedAt: new Date(),
      };
    }),
});
