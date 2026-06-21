import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const knowledgeArticles = createTable(
  "knowledge_article",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),
    category: varchar("category", { length: 100 }).notNull(),
    content: text("content").notNull(),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    documentRef: varchar("document_ref", { length: 50 }),
    importance: varchar("importance", { length: 20 }).default("standard"),
    viewCount: integer("view_count").default(0),
    searchCount: integer("search_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("onx_knowledge_article_category_idx").on(table.category)],
);

export const sechStatusLog = createTable(
  "sech_status_log",
  {
    id: serial("id").primaryKey(),
    layer: varchar("layer", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).notNull(),
    message: text("message"),
    triggeredBy: varchar("triggered_by", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_sech_status_log_layer_created_idx").on(
      table.layer,
      table.createdAt,
    ),
  ],
);

export const titanRegistry = createTable("titan_registry", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  domain: varchar("domain", { length: 256 }).notNull(),
  systemName: varchar("system_name", { length: 256 }).notNull(),
  sechPrimary: varchar("sech_primary", { length: 20 }).notNull(),
  sechSecondary: varchar("sech_secondary", { length: 20 }),
  description: text("description").notNull(),
  manifesto: text("manifesto"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const gapClosureItem = createTable("gap_closure_item", {
  id: serial("id").primaryKey(),
  sbpId: varchar("sbp_id", { length: 20 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  reason: text("reason"),
  effort: varchar("effort", { length: 50 }),
  targetGate: varchar("target_gate", { length: 20 }),
  dependencies: text("dependencies"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const visitorInteraction = createTable(
  "visitor_interaction",
  {
    id: serial("id").primaryKey(),
    sessionId: varchar("session_id", { length: 256 }).notNull(),
    page: varchar("page", { length: 256 }).notNull(),
    action: varchar("action", { length: 50 }).notNull(),
    query: text("query"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_visitor_interaction_page_action_idx").on(
      table.page,
      table.action,
    ),
  ],
);

export type KnowledgeArticle = typeof knowledgeArticles.$inferSelect;
export type SechStatusLog = typeof sechStatusLog.$inferSelect;
export type TitanRegistry = typeof titanRegistry.$inferSelect;
export type GapClosureItem = typeof gapClosureItem.$inferSelect;
export type VisitorInteraction = typeof visitorInteraction.$inferSelect;
