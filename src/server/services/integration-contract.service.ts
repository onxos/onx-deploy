import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewIntegrationContract } from "@/server/db/schema/integration-contract-foundation";
import { integrationContract } from "@/server/db/schema/integration-contract-foundation";

export async function listContracts(sourceDomain?: string) {
  if (sourceDomain) {
    return db
      .select()
      .from(integrationContract)
      .where(eq(integrationContract.sourceDomain, sourceDomain));
  }
  return db.select().from(integrationContract);
}

export async function createContract(
  input: Omit<NewIntegrationContract, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(integrationContract).values(input).returning();
  return row;
}

export async function activateContract(id: number) {
  const [row] = await db
    .update(integrationContract)
    .set({ status: "ACTIVE", updatedAt: new Date() })
    .where(eq(integrationContract.id, id))
    .returning();
  return row;
}

export async function listByTarget(targetSystem: string) {
  return db
    .select()
    .from(integrationContract)
    .where(eq(integrationContract.targetSystem, targetSystem));
}
