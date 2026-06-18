import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/db/schema";
import { knowledgeArticles } from "@/server/db/schema/civilization";

function loadLocalEnv() {
  if (process.env.DATABASE_URL) return;

  for (const file of [".env.local", ".env"]) {
    try {
      const contents = readFileSync(file, "utf8");
      for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^DATABASE_URL=(.*)$/);
        if (!match) continue;
        process.env.DATABASE_URL = match[1]?.trim().replace(/^['"]|['"]$/g, "");
        return;
      }
    } catch {
      // Keep looking; the explicit error below is clearer than a missing-file error.
    }
  }
}

function titleFromMarkdown(content: string, slug: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return (
    heading ??
    slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function categoryFromSlug(slug: string) {
  if (slug.includes("constitution")) return "constitution";
  if (slug.includes("sech")) return "sech";
  if (slug.includes("titan")) return "titans";
  if (slug.includes("gap")) return "gaps";
  if (slug.includes("capabilities")) return "va-capabilities";
  if (slug.includes("decision")) return "decisions";
  if (slug.includes("correction")) return "corrections";
  if (slug.includes("approval")) return "approvals";
  if (slug.includes("pulse")) return "pulse";
  if (slug.includes("pricing")) return "pricing";
  if (slug.includes("inventory")) return "systems";
  return "knowledge";
}

function importanceFromSlug(slug: string) {
  return [
    "constitution",
    "sech",
    "titan-registry",
    "founder-decisions",
  ].includes(slug)
    ? "critical"
    : "standard";
}

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to ingest the corpus");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });
const docsDir = join(process.cwd(), "public", "docs");

function findMarkdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return findMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

async function ingestCorpus() {
  const markdownFiles = findMarkdownFiles(docsDir).sort();

  let insertedOrUpdated = 0;

  for (const file of markdownFiles) {
    const relativePath = relative(docsDir, file);
    const slug = relativePath.replace(/\.md$/, "").split("/").join("-");
    const content = readFileSync(file, "utf8");
    const article = {
      title: titleFromMarkdown(content, slug),
      slug,
      category: categoryFromSlug(slug),
      content,
      documentRef: relativePath,
      importance: importanceFromSlug(slug),
    };

    await db
      .insert(knowledgeArticles)
      .values(article)
      .onConflictDoUpdate({
        target: knowledgeArticles.slug,
        set: {
          title: article.title,
          category: article.category,
          content: article.content,
          documentRef: article.documentRef,
          importance: article.importance,
        },
      });

    insertedOrUpdated += 1;
  }

  console.log(
    `Corpus ingestion complete. Upserted ${insertedOrUpdated} documents.`,
  );
}

ingestCorpus()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
