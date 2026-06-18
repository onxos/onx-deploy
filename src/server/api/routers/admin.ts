import { sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  gapClosureItem,
  knowledgeArticles,
  sechStatusLog,
  titanRegistry,
  visitorInteraction,
} from "@/server/db/schema/civilization";

export const adminRouter = createTRPCRouter({
  getSystemStats: protectedProcedure.query(async () => {
    const [articleCount, titanCount, gapCount, sechCount, interactionCount] =
      await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(knowledgeArticles),
        db.select({ count: sql<number>`count(*)` }).from(titanRegistry),
        db.select({ count: sql<number>`count(*)` }).from(gapClosureItem),
        db.select({ count: sql<number>`count(*)` }).from(sechStatusLog),
        db.select({ count: sql<number>`count(*)` }).from(visitorInteraction),
      ]);

    const [viewCount, searchCount] = await Promise.all([
      db.select({ sum: sql<number>`sum(view_count)` }).from(knowledgeArticles),
      db
        .select({ sum: sql<number>`sum(search_count)` })
        .from(knowledgeArticles),
    ]);

    return {
      articles: articleCount[0]?.count ?? 0,
      titans: titanCount[0]?.count ?? 0,
      gaps: gapCount[0]?.count ?? 0,
      sechStatusLogs: sechCount[0]?.count ?? 0,
      interactions: interactionCount[0]?.count ?? 0,
      totalViews: viewCount[0]?.sum ?? 0,
      totalSearches: searchCount[0]?.sum ?? 0,
    };
  }),
});
