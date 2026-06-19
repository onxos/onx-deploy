import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const titanPersona = createTable(
  "titan_persona",
  {
    id: serial("id").primaryKey(),
    titanId: varchar("titan_id", { length: 100 }).notNull().unique(),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    domain: varchar("domain", { length: 256 }).notNull(),
    style: text("style").notNull(),
    traits: jsonb("traits").$type<string[]>().default([]),
    systemPrompt: text("system_prompt").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [index("onx_titan_persona_active_idx").on(table.isActive)],
);

export type TitanPersona = typeof titanPersona.$inferSelect;
