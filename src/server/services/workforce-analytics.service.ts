/**
 * OCMBR Wave 8 — D13-S05 IU-SVC
 * Workforce Analytics service
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewWorkforceSnapshot,
  workforceSnapshot,
} from "@/server/db/schema";

export function listSnapshotsByBranch(branchId: number) {
  return db
    .select()
    .from(workforceSnapshot)
    .where(eq(workforceSnapshot.branchId, branchId))
    .orderBy(workforceSnapshot.snapshotMonth);
}

export function getSnapshotByMonth(branchId: number, snapshotMonth: string) {
  return db
    .select()
    .from(workforceSnapshot)
    .where(
      and(
        eq(workforceSnapshot.branchId, branchId),
        eq(workforceSnapshot.snapshotMonth, snapshotMonth),
      ),
    );
}

export async function upsertSnapshot(
  input: Omit<NewWorkforceSnapshot, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(workforceSnapshot).values(input).returning();
  return row;
}
