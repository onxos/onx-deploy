/**
 * OCMBR Wave 2 — D09-S02 IU-API (Service)
 * Appointment Scheduling service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  Appointment,
  NewAppointment,
} from "@/server/db/schema/appointment-foundation";
import { appointment } from "@/server/db/schema/appointment-foundation";

export async function listAppointments(
  branchId: number,
  opts?: {
    petId?: number;
    vetId?: string;
    status?: string;
    from?: Date;
    to?: Date;
  },
) {
  const conditions = [eq(appointment.branchId, branchId)];
  if (opts?.petId) conditions.push(eq(appointment.petId, opts.petId));
  if (opts?.vetId) conditions.push(eq(appointment.assignedVetId, opts.vetId));
  if (opts?.status) conditions.push(eq(appointment.status, opts.status));
  if (opts?.from) conditions.push(gte(appointment.scheduledAt, opts.from));
  if (opts?.to) conditions.push(lte(appointment.scheduledAt, opts.to));
  return db
    .select()
    .from(appointment)
    .where(and(...conditions))
    .orderBy(desc(appointment.scheduledAt))
    .limit(200);
}

export async function getAppointmentById(id: number) {
  const rows = await db
    .select()
    .from(appointment)
    .where(eq(appointment.id, id));
  return rows[0] ?? null;
}

export async function createAppointment(
  input: Omit<NewAppointment, "id" | "createdAt" | "updatedAt">,
) {
  const existing = await db
    .select({ id: appointment.id })
    .from(appointment)
    .where(eq(appointment.appointmentNumber, input.appointmentNumber));
  if (existing.length > 0)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Appointment number already exists",
    });
  const [result] = await db.insert(appointment).values(input).returning();
  return result;
}

export async function updateAppointmentStatus(
  id: number,
  status: string,
  extra?: { cancelReason?: string },
) {
  const upd: Partial<NewAppointment> = { status };
  if (status === "CANCELLED") {
    upd.cancelledAt = new Date();
    upd.cancelReason = extra?.cancelReason ?? null;
  }
  const rows = await db
    .update(appointment)
    .set(upd)
    .where(eq(appointment.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Appointment not found",
    });
  return rows[0] as Appointment;
}

export async function updateAppointment(
  id: number,
  input: Partial<
    Omit<
      NewAppointment,
      "id" | "createdAt" | "appointmentNumber" | "petId" | "clientId"
    >
  >,
) {
  const rows = await db
    .update(appointment)
    .set(input)
    .where(eq(appointment.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Appointment not found",
    });
  return rows[0] as Appointment;
}
