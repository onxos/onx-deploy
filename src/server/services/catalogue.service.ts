/**
 * OCMBR Wave 2e — D08-S02 IU-SVC
 * Service & Product Catalogue service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  catalogueCategory,
  catalogueEntry,
  type NewCatalogueCategory,
  type NewCatalogueEntry,
} from "@/server/db/schema";

export function listCategories(branchId: number) {
  return db
    .select()
    .from(catalogueCategory)
    .where(eq(catalogueCategory.branchId, branchId))
    .orderBy(catalogueCategory.sortOrder);
}

export async function createCategory(input: NewCatalogueCategory) {
  const [result] = await db.insert(catalogueCategory).values(input).returning();
  return result;
}

export function listEntries(branchId: number) {
  return db
    .select()
    .from(catalogueEntry)
    .where(eq(catalogueEntry.branchId, branchId))
    .orderBy(catalogueEntry.name);
}

export function getEntryById(id: number) {
  return db.select().from(catalogueEntry).where(eq(catalogueEntry.id, id));
}

export async function createEntry(input: NewCatalogueEntry) {
  const [result] = await db.insert(catalogueEntry).values(input).returning();
  return result;
}

export async function updateEntry(
  id: number,
  input: Partial<NewCatalogueEntry>,
) {
  const [result] = await db
    .update(catalogueEntry)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(catalogueEntry.id, id))
    .returning();
  return result;
}

export async function deactivateEntry(id: number) {
  const [result] = await db
    .update(catalogueEntry)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(catalogueEntry.id, id))
    .returning();
  return result;
}
