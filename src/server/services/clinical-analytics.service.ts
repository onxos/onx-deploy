/**
 * OCMBR Wave 8 — D14-S01 IU-SVC
 * Clinical Analytics Dashboard service
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  clinicalMetricSnapshot,
  type NewClinicalMetricSnapshot,
} from "@/server/db/schema";

export function listSnapshotsByBranch(branchId: number) {
  return db
    .select()
    .from(clinicalMetricSnapshot)
    .where(eq(clinicalMetricSnapshot.branchId, branchId))
    .orderBy(clinicalMetricSnapshot.snapshotMonth);
}

export function getSnapshotByMonth(branchId: number, snapshotMonth: string) {
  return db
    .select()
    .from(clinicalMetricSnapshot)
    .where(
      and(
        eq(clinicalMetricSnapshot.branchId, branchId),
        eq(clinicalMetricSnapshot.snapshotMonth, snapshotMonth),
      ),
    );
}

export async function upsertSnapshot(
  input: Omit<NewClinicalMetricSnapshot, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db
    .insert(clinicalMetricSnapshot)
    .values(input)
    .returning();
  return row;
}
