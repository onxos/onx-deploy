import { and, desc, eq, like, sql } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { knowledgeArticles } from "@/server/db/schema/civilization";

export const civilizationRouter = createTRPCRouter({
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
      const conditions = [];
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
        where: eq(knowledgeArticles.slug, input.slug),
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
        where: like(knowledgeArticles.content, `%${input.query}%`),
        orderBy: [desc(knowledgeArticles.searchCount)],
        limit: input.limit,
      });
    }),

  createArticle: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        slug: z.string().min(1).max(256),
        category: z.string().min(1).max(100),
        content: z.string().min(1),
        documentRef: z.string().optional(),
        importance: z
          .enum(["critical", "standard", "reference"])
          .default("standard"),
      }),
    )
    .mutation(async ({ input }) => {
      const article = await db
        .insert(knowledgeArticles)
        .values(input)
        .returning();
      return article[0];
    }),

  updateArticle: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).max(256),
        slug: z.string().min(1).max(256),
        category: z.string().min(1).max(100),
        content: z.string().min(1),
        documentRef: z.string().optional(),
        importance: z
          .enum(["critical", "standard", "reference"])
          .default("standard"),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const article = await db
        .update(knowledgeArticles)
        .set(data)
        .where(eq(knowledgeArticles.id, id))
        .returning();
      return article[0] ?? null;
    }),

  deleteArticle: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await db
        .delete(knowledgeArticles)
        .where(eq(knowledgeArticles.id, input.id));
      return { success: true };
    }),

  getAnalytics: protectedProcedure.query(async () => {
    const totalArticles = await db
      .select({ count: sql<number>`count(*)` })
      .from(knowledgeArticles);
    const totalViews = await db
      .select({ sum: sql<number>`sum(view_count)` })
      .from(knowledgeArticles);
    const categories = await db
      .select({
        category: knowledgeArticles.category,
        count: sql<number>`count(*)`,
      })
      .from(knowledgeArticles)
      .groupBy(knowledgeArticles.category);
    return {
      totalArticles: totalArticles[0]?.count ?? 0,
      totalViews: totalViews[0]?.sum ?? 0,
      categories,
    };
  }),
});
