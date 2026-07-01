/**
 * OCMBR Wave 5 — D12-S02 IU-SVC
 * Licence & Certificate Tracker service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  licenceCertificate,
  type NewLicenceCertificate,
} from "@/server/db/schema";

export function listLicences() {
  return db
    .select()
    .from(licenceCertificate)
    .orderBy(licenceCertificate.expiryDate, licenceCertificate.title);
}

export function listLicencesByStaff(staffId: string) {
  return db
    .select()
    .from(licenceCertificate)
    .where(eq(licenceCertificate.staffId, staffId))
    .orderBy(licenceCertificate.expiryDate);
}

export function getLicenceById(id: number) {
  return db
    .select()
    .from(licenceCertificate)
    .where(eq(licenceCertificate.id, id));
}

export async function createLicence(
  input: Omit<NewLicenceCertificate, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(licenceCertificate).values(input).returning();
  return row;
}

export async function updateLicenceStatus(id: number, status: string) {
  const [row] = await db
    .update(licenceCertificate)
    .set({ status, updatedAt: new Date() })
    .where(eq(licenceCertificate.id, id))
    .returning();
  return row;
}
