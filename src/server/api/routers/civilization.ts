import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, like, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { answerCivilizationQuestion } from "@/lib/ai/conversation-handler";
import { buildKnowledgeSynthesis } from "@/lib/ai/synthesis-engine";
import { requirePermission } from "@/server/api/middleware/rbac";
import {
  assertArticleMutationAllowed,
  createArticleInputSchema,
  updateArticleInputSchema,
} from "@/server/api/routers/civilization-article-contract";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { knowledgeArticles } from "@/server/db/schema/civilization";
import { knowledgeSynthesis } from "@/server/db/schema/knowledge-synthesis";

export const civilizationRouter = createTRPCRouter({
  ask: publicProcedure
    .input(z.object({ query: z.string().min(1).max(4000) }))
    .mutation(async ({ input }) => {
      return answerCivilizationQuestion(input.query);
    }),

  synthesize: publicProcedure
    .input(
      z.object({
        topic: z.string().min(1).max(256),
        type: z.enum(["topic", "comparative", "gap-analysis"]).default("topic"),
      }),
    )
    .mutation(async ({ input }) => {
      const synthesis = await buildKnowledgeSynthesis(input.topic, input.type);
      const [record] = await db
        .insert(knowledgeSynthesis)
        .values({
          topic: input.topic,
          synthesisType: input.type,
          summary: synthesis.summary,
          sourceRefs: synthesis.sourceRefs,
          confidence: synthesis.confidence,
        })
        .returning();
      return { ...synthesis, id: record?.id };
    }),

  getSynthesis: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return db.query.knowledgeSynthesis.findFirst({
        where: eq(knowledgeSynthesis.id, input.id),
      });
    }),

  listArticles: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conditions = [isNull(knowledgeArticles.deletedAt)];
      if (input?.category) {
        conditions.push(eq(knowledgeArticles.category, input.category));
      }
      return db.query.knowledgeArticles.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(knowledgeArticles.createdAt)],
        limit: input?.limit ?? 50,
        offset: input?.offset ?? 0,
      });
    }),

  getArticle: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const article = await db.query.knowledgeArticles.findFirst({
        where: and(
          eq(knowledgeArticles.slug, input.slug),
          isNull(knowledgeArticles.deletedAt),
        ),
      });
      if (article) {
        await db
          .update(knowledgeArticles)
          .set({ viewCount: sql`${knowledgeArticles.viewCount} + 1` })
          .where(eq(knowledgeArticles.id, article.id));
      }
      return article;
    }),

  searchArticles: publicProcedure
    .input(
      z.object({ query: z.string().min(1), limit: z.number().default(20) }),
    )
    .query(async ({ input }) => {
      return db.query.knowledgeArticles.findMany({
        where: and(
          like(knowledgeArticles.content, `%${input.query}%`),
          isNull(knowledgeArticles.deletedAt),
        ),
        orderBy: [desc(knowledgeArticles.searchCount)],
        limit: input.limit,
      });
    }),

  createArticle: protectedProcedure
    .use(requirePermission("article:create"))
    .input(createArticleInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.knowledgeArticles.findFirst({
        where: eq(knowledgeArticles.slug, input.slug),
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Article slug must be unique",
        });
      }

      const article = await db
        .insert(knowledgeArticles)
        .values({ ...input, ownerId: ctx.user.id })
        .returning();
      return article[0];
    }),

  updateArticle: protectedProcedure
    .input(updateArticleInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await db.query.knowledgeArticles.findFirst({
        where: and(
          eq(knowledgeArticles.id, id),
          isNull(knowledgeArticles.deletedAt),
        ),
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      assertArticleMutationAllowed({
        action: "update",
        actorId: ctx.user.id,
        actorRole: ctx.user.role,
        ownerId: existing.ownerId,
      });

      if (data.slug) {
        const slugConflict = await db.query.knowledgeArticles.findFirst({
          where: and(
            eq(knowledgeArticles.slug, data.slug),
            ne(knowledgeArticles.id, id),
          ),
        });
        if (slugConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Article slug must be unique",
          });
        }
      }

      const article = await db
        .update(knowledgeArticles)
        .set(data)
        .where(eq(knowledgeArticles.id, id))
        .returning();
      return article[0] ?? null;
    }),

  deleteArticle: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.knowledgeArticles.findFirst({
        where: and(
          eq(knowledgeArticles.id, input.id),
          isNull(knowledgeArticles.deletedAt),
        ),
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      assertArticleMutationAllowed({
        action: "delete",
        actorId: ctx.user.id,
        actorRole: ctx.user.role,
        ownerId: existing.ownerId,
      });

      const [article] = await db
        .update(knowledgeArticles)
        .set({ deletedAt: new Date() })
        .where(eq(knowledgeArticles.id, input.id))
        .returning();
      return { success: true, article };
    }),

  getAnalytics: protectedProcedure
    .use(requirePermission("analytics:read"))
    .query(async () => {
      const [totalArticles, totalViews, categories] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(knowledgeArticles),
        db
          .select({ sum: sql<number>`sum(view_count)` })
          .from(knowledgeArticles),
        db
          .select({
            category: knowledgeArticles.category,
            count: sql<number>`count(*)`,
          })
          .from(knowledgeArticles)
          .groupBy(knowledgeArticles.category),
      ]);
      return {
        totalArticles: totalArticles[0]?.count ?? 0,
        totalViews: totalViews[0]?.sum ?? 0,
        categories,
      };
    }),
});
