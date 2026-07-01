/**
 * OCMBR Wave 2e — D08-S09 IU-SVC
 * Shift Management & Till Close service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewShiftEvent,
  type NewTillClose,
  shiftEvent,
  tillClose,
} from "@/server/db/schema";

export function listTillCloses(branchId: number) {
  return db
    .select()
    .from(tillClose)
    .where(eq(tillClose.branchId, branchId))
    .orderBy(tillClose.closedAt);
}

export function getTillCloseById(id: number) {
  return db.select().from(tillClose).where(eq(tillClose.id, id));
}

export async function createTillClose(input: NewTillClose) {
  const [result] = await db.insert(tillClose).values(input).returning();
  return result;
}

export async function reviewTillClose(id: number, notes: string) {
  const [result] = await db
    .update(tillClose)
    .set({ status: "REVIEWED", supervisorNotes: notes, updatedAt: new Date() })
    .where(eq(tillClose.id, id))
    .returning();
  return result;
}

export function getShiftEvents(shiftId: number) {
  return db
    .select()
    .from(shiftEvent)
    .where(eq(shiftEvent.shiftId, shiftId))
    .orderBy(shiftEvent.eventAt);
}

export async function logShiftEvent(input: NewShiftEvent) {
  const [result] = await db.insert(shiftEvent).values(input).returning();
  return result;
}
