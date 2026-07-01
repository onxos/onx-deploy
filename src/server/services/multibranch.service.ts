import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewBranchConfig,
  NewCurrencyRate,
  NewInterBranchTransfer,
} from "@/server/db/schema/multibranch-foundation";
import {
  branchConfig,
  currencyRate,
  interBranchTransfer,
} from "@/server/db/schema/multibranch-foundation";

// ── Inter-branch Transfer (D15-S06) ───────────────────────────────────────────

export async function listTransfers(
  fromBranchId?: string,
  toBranchId?: string,
) {
  if (fromBranchId) {
    return db
      .select()
      .from(interBranchTransfer)
      .where(eq(interBranchTransfer.fromBranchId, fromBranchId));
  }
  if (toBranchId) {
    return db
      .select()
      .from(interBranchTransfer)
      .where(eq(interBranchTransfer.toBranchId, toBranchId));
  }
  return db.select().from(interBranchTransfer);
}

export async function createTransfer(
  input: Omit<NewInterBranchTransfer, "id" | "requestedAt">,
) {
  const [row] = await db.insert(interBranchTransfer).values(input).returning();
  return row;
}

export async function approveTransfer(id: number, approvedBy: string) {
  const [row] = await db
    .update(interBranchTransfer)
    .set({ status: "APPROVED", approvedBy })
    .where(eq(interBranchTransfer.id, id))
    .returning();
  return row;
}

export async function completeTransfer(id: number) {
  const [row] = await db
    .update(interBranchTransfer)
    .set({ status: "COMPLETED", completedAt: new Date() })
    .where(eq(interBranchTransfer.id, id))
    .returning();
  return row;
}

// ── Branch Config Override (D15-S07) ──────────────────────────────────────────

export async function listBranchConfigs(branchId: string) {
  return db
    .select()
    .from(branchConfig)
    .where(eq(branchConfig.branchId, branchId));
}

export async function upsertBranchConfig(
  input: Omit<NewBranchConfig, "id" | "createdAt">,
) {
  const [row] = await db.insert(branchConfig).values(input).returning();
  return row;
}

export async function deleteBranchConfig(id: number) {
  return db.delete(branchConfig).where(eq(branchConfig.id, id));
}

// ── Currency Rates (D15-S08) ──────────────────────────────────────────────────

export async function listActiveCurrencyRates(fromCurrency?: string) {
  if (fromCurrency) {
    return db
      .select()
      .from(currencyRate)
      .where(
        and(
          eq(currencyRate.fromCurrency, fromCurrency),
          eq(currencyRate.isActive, true),
        ),
      );
  }
  return db.select().from(currencyRate).where(eq(currencyRate.isActive, true));
}

export async function upsertCurrencyRate(
  input: Omit<NewCurrencyRate, "id" | "createdAt">,
) {
  const [row] = await db.insert(currencyRate).values(input).returning();
  return row;
}
