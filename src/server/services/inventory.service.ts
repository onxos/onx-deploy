/**
 * OCMBR Wave 1 — D05-S01 Service Layer
 * Inventory Service: Item Category + Item management
 * IU-ID: D05-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewItem,
  NewItemCategory,
} from "@/server/db/schema/inventory-foundation";
import { item, itemCategory } from "@/server/db/schema/inventory-foundation";

// ── Item Category ─────────────────────────────────────────────────────────────

export async function listItemCategories(activeOnly = true) {
  return activeOnly
    ? db.select().from(itemCategory).where(eq(itemCategory.isActive, true))
    : db.select().from(itemCategory);
}

export async function createItemCategory(
  input: Omit<NewItemCategory, "id" | "createdAt">,
) {
  const [dup] = await db
    .select({ id: itemCategory.id })
    .from(itemCategory)
    .where(eq(itemCategory.code, input.code));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Category code already exists",
    });
  const [result] = await db.insert(itemCategory).values(input).returning();
  return result;
}

export async function updateItemCategory(
  id: number,
  input: Partial<Omit<NewItemCategory, "id" | "createdAt">>,
) {
  const rows = await db
    .update(itemCategory)
    .set(input)
    .where(eq(itemCategory.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
  return rows[0];
}

// ── Item ──────────────────────────────────────────────────────────────────────

export async function listItems(opts?: {
  search?: string;
  categoryId?: number;
  itemType?: string;
  activeOnly?: boolean;
  limit?: number;
}) {
  const conditions = [];
  if (opts?.activeOnly !== false) conditions.push(eq(item.isActive, true));
  if (opts?.categoryId) conditions.push(eq(item.categoryId, opts.categoryId));
  if (opts?.itemType) conditions.push(eq(item.itemType, opts.itemType));
  if (opts?.search) {
    const searchClause = or(
      ilike(item.name, `%${opts.search}%`),
      ilike(item.sku, `%${opts.search}%`),
    );
    if (searchClause) conditions.push(searchClause);
  }
  const q = db
    .select()
    .from(item)
    .limit(opts?.limit ?? 100);
  return conditions.length > 0 ? q.where(and(...conditions)) : q;
}

export async function getItemById(id: number) {
  const [row] = await db.select().from(item).where(eq(item.id, id));
  return row ?? null;
}

export async function getItemBySku(sku: string) {
  const [row] = await db.select().from(item).where(eq(item.sku, sku));
  return row ?? null;
}

export async function createItem(
  input: Omit<NewItem, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: item.id })
    .from(item)
    .where(eq(item.sku, input.sku));
  if (dup)
    throw new TRPCError({ code: "CONFLICT", message: "SKU already exists" });
  if (input.barcode) {
    const [dupBarcode] = await db
      .select({ id: item.id })
      .from(item)
      .where(eq(item.barcode, input.barcode));
    if (dupBarcode)
      throw new TRPCError({
        code: "CONFLICT",
        message: "Barcode already registered",
      });
  }
  const [result] = await db.insert(item).values(input).returning();
  return result;
}

export async function updateItem(
  id: number,
  input: Partial<Omit<NewItem, "id" | "createdAt">>,
) {
  const rows = await db
    .update(item)
    .set(input)
    .where(eq(item.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Item not found" });
  return rows[0];
}
