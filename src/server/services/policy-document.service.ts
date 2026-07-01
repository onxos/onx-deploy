/**
 * OCMBR Wave 7 — D12-S07 IU-SVC
 * Policy & Procedure Management service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { type NewPolicyDocument, policyDocument } from "@/server/db/schema";

export function listDocuments() {
  return db.select().from(policyDocument).orderBy(policyDocument.title);
}

export function getDocumentById(id: number) {
  return db.select().from(policyDocument).where(eq(policyDocument.id, id));
}

export async function createDocument(
  input: Omit<NewPolicyDocument, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(policyDocument).values(input).returning();
  return row;
}

export async function approveDocument(id: number, approvedById: string) {
  const [row] = await db
    .update(policyDocument)
    .set({ status: "APPROVED", approvedById, updatedAt: new Date() })
    .where(eq(policyDocument.id, id))
    .returning();
  return row;
}

export async function archiveDocument(id: number) {
  const [row] = await db
    .update(policyDocument)
    .set({ status: "ARCHIVED", updatedAt: new Date() })
    .where(eq(policyDocument.id, id))
    .returning();
  return row;
}
