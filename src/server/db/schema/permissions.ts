import { index, pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const permission = createTable(
  "permission",
  {
    id: text("id").primaryKey(),
    role: text("role").notNull(),
    permission: text("permission").notNull(),
    resource: text("resource").notNull(),
    action: text("action").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("onx_permission_role_idx").on(table.role),
    index("onx_permission_permission_idx").on(table.permission),
  ],
);

export type PermissionRecord = typeof permission.$inferSelect;
