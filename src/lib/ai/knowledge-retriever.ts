import { desc, like } from "drizzle-orm";
import { db } from "@/server/db";
import { knowledgeArticles } from "@/server/db/schema/civilization";

export type RetrievedSource = {
  title: string;
  slug: string;
  excerpt: string;
};

export async function retrieveKnowledge(
  query: string,
  limit = 5,
): Promise<RetrievedSource[]> {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  const primaryTerm = terms[0] ?? query;
  const articles = await db.query.knowledgeArticles.findMany({
    where: like(knowledgeArticles.content, `%${primaryTerm}%`),
    orderBy: [desc(knowledgeArticles.searchCount)],
    limit,
  });

  return articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    excerpt: article.content.slice(0, 260),
  }));
}
