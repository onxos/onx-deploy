/**
 * OCMBR Wave 3 — D10-S02 IU-SVC
 * In-house Analyser Integration Hooks service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { analyserDevice, type NewAnalyserDevice } from "@/server/db/schema";

export function listAnalyserDevices(branchId: number) {
  return db
    .select()
    .from(analyserDevice)
    .where(eq(analyserDevice.branchId, branchId))
    .orderBy(analyserDevice.deviceName);
}

export function getAnalyserDeviceById(id: number) {
  return db.select().from(analyserDevice).where(eq(analyserDevice.id, id));
}

export async function createAnalyserDevice(
  input: Omit<NewAnalyserDevice, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(analyserDevice).values(input).returning();
  return row;
}

export async function updateAnalyserDeviceStatus(id: number, status: string) {
  const [row] = await db
    .update(analyserDevice)
    .set({ status, updatedAt: new Date() })
    .where(eq(analyserDevice.id, id))
    .returning();
  return row;
}

export async function recordCalibration(id: number, calibratedDate: string) {
  const [row] = await db
    .update(analyserDevice)
    .set({
      lastCalibrated: calibratedDate,
      updatedAt: new Date(),
    })
    .where(eq(analyserDevice.id, id))
    .returning();
  return row;
}
